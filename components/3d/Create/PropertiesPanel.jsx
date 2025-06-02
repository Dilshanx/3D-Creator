// // import { useCallback, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Slider } from "@/components/ui/slider";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   ImageUp,
// //   Trash2,
// //   Palette,
// //   LayersIcon as LayersIconLucide,
// //   Type as TypeIcon,
// //   X,
// //   Package,
// //   ImageIcon,
// // } from "lucide-react";
// // import * as THREE from "three";

// // const initialTextureProps = {
// //   mapUrl: null,
// //   normalMapUrl: null,
// //   roughnessMapUrl: null,
// //   metalnessMapUrl: null,
// //   aoMapUrl: null,
// //   emissiveMapUrl: null,
// // };

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
// // }) {
// //   const shapeDisplayOptions = [
// //     { name: "Cube", type: "box", icon: "🧊" },
// //     { name: "Sphere", type: "sphere", icon: "⚪" },
// //     { name: "Cylinder", type: "cylinder", icon: "🥫" },
// //     { name: "Cone", type: "cone", icon: "🔺" },
// //     { name: "Torus", type: "torus", icon: "🍩" },
// //     { name: "Pyramid", type: "pyramid", icon: "🔺" },
// //     { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
// //     { name: "Image Plane", type: "imagePlane", icon: <ImageIcon size={18} /> },
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
// //   const materialOptions = [
// //     { name: "Standard (PBR)", type: "standard" },
// //     { name: "Physical (PBR)", type: "physical" },
// //     { name: "Toon", type: "toon" },
// //     { name: "Basic (Non-PBR)", type: "basic" },
// //     { name: "Lambert (Non-PBR)", type: "lambert" },
// //     { name: "Phong (Non-PBR)", type: "phong" },
// //     { name: "Wireframe", type: "wireframe" },
// //   ];

// //   const currentShapeType = selectedShape?.type;
// //   const isCustomExtruded = currentShapeType === "customExtruded";
// //   const isImportedGLB = currentShapeType === "importedGLB";
// //   const isText = currentShapeType === "text";
// //   const isImagePlane = currentShapeType === "imagePlane";

// //   const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;
// //   const showPBRForGLBOverride =
// //     glbMaterialOverride &&
// //     ["standard", "physical"].includes(glbMaterialOverride.type);
// //   const showPBRPropertiesForPrimitives =
// //     !isImportedGLB &&
// //     !isImagePlane &&
// //     selectedShape &&
// //     ["standard", "physical"].includes(selectedShape.material);

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

// //   const handleGLBMaterialOverrideUpdate = useCallback(
// //     (property, value) => {
// //       if (!selectedShape || !isImportedGLB) return;
// //       const currentOverride = selectedShape.glbMaterialOverride || {};
// //       let newOverrideSettings = { ...currentOverride, [property]: value };

// //       if (property === "type") {
// //         if (value === "model") {
// //           // Reverting to model's own
// //           newOverrideSettings = null; // Signal to remove override
// //         } else {
// //           // Set defaults for new type if not already set or if type changes
// //           newOverrideSettings.color =
// //             currentOverride.color || selectedShape.color || "#cccccc";
// //           if (value === "standard" || value === "physical") {
// //             newOverrideSettings.roughness = currentOverride.roughness ?? 0.5;
// //             newOverrideSettings.metalness = currentOverride.metalness ?? 0.0;
// //           } else {
// //             delete newOverrideSettings.roughness;
// //             delete newOverrideSettings.metalness;
// //           }
// //           if (value === "physical") {
// //             newOverrideSettings.transmission =
// //               currentOverride.transmission ?? 0.0;
// //             newOverrideSettings.ior = currentOverride.ior ?? 1.5;
// //             newOverrideSettings.thickness = currentOverride.thickness ?? 0.01;
// //           } else {
// //             delete newOverrideSettings.transmission;
// //             delete newOverrideSettings.ior;
// //             delete newOverrideSettings.thickness;
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

// //   const allTextureSlots = [
// //     { id: "map", name: "Base Color (Albedo)" },
// //     { id: "normalMap", name: "Normal Map" },
// //     { id: "roughnessMap", name: "Roughness Map" },
// //     { id: "metalnessMap", name: "Metalness Map" },
// //     { id: "aoMap", name: "AO Map" },
// //     { id: "emissiveMap", name: "Emissive Map" },
// //   ];

// //   let activeTextureSlots = [];
// //   let currentTextureValues = initialTextureProps;
// //   let fileInputRefsToUse = shapeTextureFileInputRefs;
// //   let texturePropsKeyForShape = "textureProps";

// //   if (isText) {
// //     activeTextureSlots = [
// //       { id: "map", name: "Color/Albedo Map" },
// //       { id: "normalMap", name: "Normal Map" },
// //     ];
// //     currentTextureValues =
// //       selectedShape?.textTextureProps || initialTextureProps;
// //     fileInputRefsToUse = textTextureFileInputRefs;
// //     texturePropsKeyForShape = "textTextureProps";
// //   } else if (isImportedGLB) {
// //     activeTextureSlots = allTextureSlots;
// //     currentTextureValues = selectedShape?.textureProps || initialTextureProps; // GLB uses shape.textureProps for overrides
// //     fileInputRefsToUse = shapeTextureFileInputRefs;
// //     texturePropsKeyForShape = "textureProps";
// //   } else if (!isImagePlane) {
// //     activeTextureSlots = allTextureSlots;
// //     currentTextureValues = selectedShape?.textureProps || initialTextureProps;
// //     fileInputRefsToUse = shapeTextureFileInputRefs;
// //     texturePropsKeyForShape = "textureProps";
// //   }

// //   const getShapeIcon = () => {
// //     if (!selectedShape) return "❓";
// //     const iconData = shapeDisplayOptions.find(
// //       (s) => s.type === currentShapeType
// //     );
// //     if (iconData)
// //       return typeof iconData.icon === "string" ? (
// //         <span className='text-2xl'>{iconData.icon}</span>
// //       ) : (
// //         iconData.icon
// //       );
// //     if (isCustomExtruded)
// //       return (
// //         <span className='text-2xl'>
// //           {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
// //         </span>
// //       );
// //     return <span className='text-2xl'>🔷</span>;
// //   };

// //   return (
// //     <motion.div
// //       initial={{ x: 20, opacity: 0 }}
// //       animate={{ x: 0, opacity: 1 }}
// //       transition={{ delay: 0.3 }}
// //       className='w-80 p-6 bg-card/60 backdrop-blur-lg border-l border-border/60 overflow-y-auto shadow-2xl text-foreground'
// //     >
// //       <AnimatePresence mode='wait'>
// //         {selectedShape ? (
// //           <motion.div
// //             key={selectedShape.id}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -20 }}
// //             className='space-y-6'
// //           >
// //             <div className='flex justify-between items-center'>
// //               <div>
// //                 <h3 className='text-lg font-semibold'>Properties</h3>
// //                 <p className='text-sm text-muted-foreground'>
// //                   Customize selected object
// //                 </p>
// //               </div>
// //               <div className='flex space-x-1'>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       onClick={duplicateShape}
// //                       variant='ghost'
// //                       size='icon'
// //                       className='w-8 h-8'
// //                     >
// //                       <LayersIconLucide size={16} />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent>Duplicate (Ctrl+D)</TooltipContent>
// //                 </Tooltip>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       onClick={() => removeShape(selectedShape.id)}
// //                       variant='ghost'
// //                       size='icon'
// //                       className='w-8 h-8 text-destructive hover:bg-destructive/10'
// //                     >
// //                       <Trash2 size={16} />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent>Delete (Del/Backspace)</TooltipContent>
// //                 </Tooltip>
// //               </div>
// //             </div>
// //             <Separator />

// //             <Card className='bg-background/50'>
// //               <CardContent className='p-4'>
// //                 <div className='text-xs text-muted-foreground mb-1'>
// //                   Selected Object
// //                 </div>
// //                 <div className='text-lg font-medium capitalize flex items-center space-x-2 truncate'>
// //                   {getShapeIcon()}
// //                   <span
// //                     className='truncate'
// //                     title={selectedShape.name || currentShapeType}
// //                   >
// //                     {selectedShape.name ||
// //                       (isText ? "3D Text" : currentShapeType)}
// //                   </span>
// //                 </div>
// //                 {isText && (
// //                   <p className='text-xs text-muted-foreground mt-1 truncate'>
// //                     "{selectedShape.text || "Empty"}"
// //                   </p>
// //                 )}
// //                 {isImagePlane && (
// //                   <p className='text-xs text-muted-foreground mt-1'>
// //                     Dims: {selectedShape.originalWidth}x
// //                     {selectedShape.originalHeight}px
// //                   </p>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             {isText && (
// //               <Card className='bg-background/50'>
// //                 <CardHeader>
// //                   <CardTitle className='text-base'>Text Settings</CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4'>
// //                   <div>
// //                     <Label htmlFor='text-content'>Content</Label>
// //                     <Input
// //                       id='text-content'
// //                       value={selectedShape.text || ""}
// //                       onChange={(e) =>
// //                         handleGenericUpdate("text", e.target.value)
// //                       }
// //                       placeholder='Enter text...'
// //                       className='mt-1'
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label>
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
// //                       className='mt-2'
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label>
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
// //                       className='mt-2'
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {isCustomExtruded && (
// //               <Card className='bg-background/50'>
// //                 <CardHeader>
// //                   <CardTitle className='text-base'>Custom Shape</CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4'>
// //                   <div>
// //                     <Label>
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
// //                       className='mt-2'
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label>
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
// //                       className='mt-2'
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             <Card className='bg-background/50'>
// //               <CardHeader>
// //                 <CardTitle className='text-base'>Transform</CardTitle>
// //               </CardHeader>
// //               <CardContent className='space-y-4'>
// //                 {["position", "rotation", "scale"].map((prop) => (
// //                   <div key={prop} className='space-y-2'>
// //                     <h4 className='font-medium text-sm capitalize'>{prop}</h4>
// //                     {["X", "Y", "Z"].map((axis, index) => (
// //                       <div
// //                         key={axis}
// //                         className='grid grid-cols-6 items-center gap-2'
// //                       >
// //                         <Label
// //                           htmlFor={`${prop}-${axis}`}
// //                           className='text-xs col-span-1'
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
// //                           className='col-span-2 h-8 text-xs'
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
// //                           className='col-span-3 mt-1'
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ))}
// //               </CardContent>
// //             </Card>

// //             {!isImagePlane && (
// //               <Card className='bg-background/50'>
// //                 <CardHeader>
// //                   <CardTitle className='text-base flex items-center'>
// //                     <Palette size={16} className='mr-2 text-purple-400' />{" "}
// //                     Appearance
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4'>
// //                   {isImportedGLB ? (
// //                     <>
// //                       <p className='text-xs text-muted-foreground'>
// //                         Override the model's embedded materials. Changes apply
// //                         to all meshes.
// //                       </p>
// //                       <div>
// //                         <Label>Override Material Type</Label>
// //                         <Select
// //                           value={glbMaterialOverride?.type || "model"}
// //                           onValueChange={(newType) =>
// //                             handleGLBMaterialOverrideUpdate("type", newType)
// //                           }
// //                         >
// //                           <SelectTrigger className='mt-1'>
// //                             <SelectValue />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectItem value='model'>
// //                               Use Model's Own Materials
// //                             </SelectItem>
// //                             {materialOptions.map((m) => (
// //                               <SelectItem key={m.type} value={m.type}>
// //                                 {m.name}
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </div>

// //                       {glbMaterialOverride &&
// //                         glbMaterialOverride.type !== "model" && (
// //                           <>
// //                             <Separator className='my-3' />
// //                             <div>
// //                               <Label>Override Base Color</Label>
// //                               <div className='flex items-center space-x-2 mt-1'>
// //                                 <Input
// //                                   type='color'
// //                                   value={glbMaterialOverride.color || "#cccccc"}
// //                                   onChange={(e) =>
// //                                     handleGLBMaterialOverrideUpdate(
// //                                       "color",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className='p-1 h-10 w-14 rounded-md border cursor-pointer'
// //                                 />
// //                                 <Input
// //                                   value={glbMaterialOverride.color || "#cccccc"}
// //                                   onChange={(e) =>
// //                                     handleGLBMaterialOverrideUpdate(
// //                                       "color",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className='flex-1 h-10'
// //                                 />
// //                               </div>
// //                             </div>

// //                             {showPBRForGLBOverride && (
// //                               <>
// //                                 <div>
// //                                   <Label>
// //                                     Override Roughness:{" "}
// //                                     {Number(
// //                                       glbMaterialOverride.roughness ?? 0.5
// //                                     ).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[
// //                                       glbMaterialOverride.roughness ?? 0.5,
// //                                     ]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "roughness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className='mt-2'
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label>
// //                                     Override Metalness:{" "}
// //                                     {Number(
// //                                       glbMaterialOverride.metalness ?? 0.0
// //                                     ).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[
// //                                       glbMaterialOverride.metalness ?? 0.0,
// //                                     ]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "metalness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className='mt-2'
// //                                   />
// //                                 </div>
// //                               </>
// //                             )}
// //                           </>
// //                         )}
// //                     </>
// //                   ) : (
// //                     <>
// //                       <div>
// //                         <Label>Material</Label>
// //                         <Select
// //                           value={selectedShape.material || "standard"}
// //                           onValueChange={(v) =>
// //                             handleGenericUpdate("material", v)
// //                           }
// //                         >
// //                           <SelectTrigger className='mt-1'>
// //                             <SelectValue />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             {materialOptions.map((m) => (
// //                               <SelectItem key={m.type} value={m.type}>
// //                                 {m.name}
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                       <div>
// //                         <Label>Color</Label>
// //                         <div className='flex items-center space-x-2 mt-1'>
// //                           <Input
// //                             type='color'
// //                             value={selectedShape.color || "#ffffff"}
// //                             onChange={(e) =>
// //                               handleGenericUpdate("color", e.target.value)
// //                             }
// //                             className='p-1 h-10 w-14 rounded-md border cursor-pointer'
// //                           />
// //                           <Input
// //                             value={selectedShape.color || "#ffffff"}
// //                             onChange={(e) =>
// //                               handleGenericUpdate("color", e.target.value)
// //                             }
// //                             className='flex-1 h-10'
// //                           />
// //                         </div>
// //                       </div>
// //                       {showPBRPropertiesForPrimitives && (
// //                         <>
// //                           <Separator className='my-3' />
// //                           <div>
// //                             <Label>
// //                               Roughness:{" "}
// //                               {Number(selectedShape.roughness || 0.5).toFixed(
// //                                 2
// //                               )}
// //                             </Label>
// //                             <Slider
// //                               value={[selectedShape.roughness || 0.5]}
// //                               onValueChange={([v]) =>
// //                                 handleGenericUpdate("roughness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className='mt-2'
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label>
// //                               Metalness:{" "}
// //                               {Number(selectedShape.metalness || 0.0).toFixed(
// //                                 2
// //                               )}
// //                             </Label>
// //                             <Slider
// //                               value={[selectedShape.metalness || 0.0]}
// //                               onValueChange={([v]) =>
// //                                 handleGenericUpdate("metalness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className='mt-2'
// //                             />
// //                           </div>
// //                         </>
// //                       )}
// //                     </>
// //                   )}

// //                   <Separator className='my-3' />
// //                   <h4 className='text-sm font-semibold text-purple-300 flex items-center'>
// //                     <ImageUp size={14} className='mr-1.5' />
// //                     {isText
// //                       ? "Text Textures"
// //                       : isImportedGLB
// //                       ? "Apply Textures to Override"
// //                       : "Shape Textures"}
// //                   </h4>
// //                   <div className='grid grid-cols-2 gap-3'>
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
// //                             className='text-xs'
// //                           >
// //                             {slot.name}
// //                           </Label>
// //                           {currentUrl && (
// //                             <div className='relative group w-full aspect-square bg-muted rounded overflow-hidden mb-1'>
// //                               <img
// //                                 src={currentUrl}
// //                                 alt={`${slot.name} preview`}
// //                                 className='w-full h-full object-cover'
// //                               />
// //                               <Button
// //                                 variant='destructive'
// //                                 size='icon'
// //                                 className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
// //                                 onClick={() =>
// //                                   handleClearTexture(
// //                                     selectedShape.id,
// //                                     slot.id,
// //                                     isText
// //                                   )
// //                                 }
// //                                 title={`Clear ${slot.name}`}
// //                               >
// //                                 <Trash2 size={12} />
// //                               </Button>
// //                             </div>
// //                           )}
// //                           <div className='flex items-center space-x-1'>
// //                             <Button
// //                               variant='outline'
// //                               size='xs'
// //                               className='w-full text-xs'
// //                               onClick={() => fileInputRef?.click()}
// //                             >
// //                               <ImageUp size={12} className='mr-1.5' />{" "}
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
// //                                     isText
// //                                   )
// //                                 }
// //                                 title={`Clear ${slot.name}`}
// //                                 className='p-1 h-auto'
// //                               >
// //                                 <X size={12} />
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

// //             <Card className='bg-background/50'>
// //               <CardHeader>
// //                 <CardTitle className='text-base'>Animation</CardTitle>
// //               </CardHeader>
// //               <CardContent className='space-y-4'>
// //                 <div>
// //                   <Label>Type</Label>
// //                   <Select
// //                     value={animation.type}
// //                     onValueChange={(v) => handleAnimationUpdate("type", v)}
// //                   >
// //                     <SelectTrigger className='mt-1'>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value='none'>None</SelectItem>
// //                       <SelectItem value='rotate'>Rotate</SelectItem>
// //                       <SelectItem value='orbit'>Orbit</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 {animation.type !== "none" && (
// //                   <>
// //                     <div>
// //                       <Label>Speed: {Number(animation.speed).toFixed(2)}</Label>
// //                       <Slider
// //                         value={[animation.speed]}
// //                         onValueChange={([v]) =>
// //                           handleAnimationUpdate("speed", v)
// //                         }
// //                         min={0.05}
// //                         max={5}
// //                         step={0.05}
// //                         className='mt-2'
// //                       />
// //                     </div>
// //                     {animation.type === "rotate" && (
// //                       <div>
// //                         <Label>Rotation Axis</Label>
// //                         <Select
// //                           value={animation.axis}
// //                           onValueChange={(v) =>
// //                             handleAnimationUpdate("axis", v)
// //                           }
// //                         >
// //                           <SelectTrigger className='mt-1'>
// //                             <SelectValue />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             <SelectItem value='x'>X-Axis</SelectItem>
// //                             <SelectItem value='y'>Y-Axis</SelectItem>
// //                             <SelectItem value='z'>Z-Axis</SelectItem>
// //                           </SelectContent>
// //                         </Select>
// //                       </div>
// //                     )}
// //                     {animation.type === "orbit" && (
// //                       <>
// //                         <div>
// //                           <Label>
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
// //                             className='mt-2'
// //                           />
// //                         </div>
// //                         <div>
// //                           <Label>Orbit Plane</Label>
// //                           <Select
// //                             value={animation.orbitPlane || "xz"}
// //                             onValueChange={(v) =>
// //                               handleAnimationUpdate("orbitPlane", v)
// //                             }
// //                           >
// //                             <SelectTrigger className='mt-1'>
// //                               <SelectValue />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                               <SelectItem value='xy'>
// //                                 XY Plane (Vertical)
// //                               </SelectItem>
// //                               <SelectItem value='xz'>
// //                                 XZ Plane (Horizontal)
// //                               </SelectItem>
// //                               <SelectItem value='yz'>
// //                                 YZ Plane (Side Vertical)
// //                               </SelectItem>
// //                             </SelectContent>
// //                           </Select>
// //                         </div>
// //                         <div className='space-y-1'>
// //                           <Label>Orbit Center</Label>
// //                           <div className='grid grid-cols-3 gap-2 items-center'>
// //                             {["X", "Y", "Z"].map((axisName, index) => (
// //                               <div key={axisName}>
// //                                 <Label
// //                                   htmlFor={`orbit-center-${axisName}`}
// //                                   className='text-xs'
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
// //                                   className='h-8 text-xs mt-0.5'
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

// //             <Card className='bg-background/50'>
// //               <CardHeader>
// //                 <CardTitle className='text-base'>Quick Actions</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className='grid grid-cols-2 gap-2'>
// //                   <Button
// //                     onClick={() => handleQuickAction("resetScale")}
// //                     variant='outline'
// //                     size='sm'
// //                   >
// //                     Reset Scale
// //                   </Button>
// //                   <Button
// //                     onClick={() => handleQuickAction("resetRotation")}
// //                     variant='outline'
// //                     size='sm'
// //                   >
// //                     Reset Rotation
// //                   </Button>
// //                   <Button
// //                     onClick={() => handleQuickAction("centerObject")}
// //                     variant='outline'
// //                     size='sm'
// //                   >
// //                     Center Object
// //                   </Button>
// //                   {!isImagePlane && (
// //                     <Button
// //                       onClick={() => handleQuickAction("randomColor")}
// //                       variant='outline'
// //                       size='sm'
// //                     >
// //                       Random Color
// //                     </Button>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </motion.div>
// //         ) : (
// //           <motion.div
// //             key='empty'
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -20 }}
// //             className='flex flex-col items-center justify-center h-full text-center'
// //           >
// //             <div className='text-6xl mb-6'>✨</div>
// //             <h3 className='text-xl font-semibold mb-2'>No Object Selected</h3>
// //             <p className='text-muted-foreground mb-6 leading-relaxed px-4'>
// //               Click an object, or add/import one.
// //             </p>
// //             <div className='space-y-3 w-full max-w-xs'>
// //               <Button onClick={() => addShape("box")} className='w-full'>
// //                 🧊 Add Cube
// //               </Button>
// //               <Button
// //                 onClick={() => addShape("text")}
// //                 variant='outline'
// //                 className='w-full'
// //               >
// //                 📝 Add 3D Text
// //               </Button>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }

// // components/3d/Create/PropertiesPanel.jsx
// import React from "react";
// // ... other imports like Slider, Input, ColorPicker, Accordion, Button, etc.
// import ForceRefreshButton from "@/components/ui/ForceRefreshButton"; // Import the new button

// const PropertiesPanel = ({
//   selectedShape,
//   updateShape,
//   removeShape,
//   duplicateShape,
//   addShape,
//   handleTextureUpload,
//   handleClearTexture,
//   shapeTextureFileInputRefs,
//   textTextureFileInputRefs,
//   forceRefreshCanvas, // Receive the new prop
// }) => {
//   if (!selectedShape) {
//     return (
//       <div className='w-80 bg-slate-800 p-6 space-y-6 overflow-y-auto text-sm border-l border-border/60 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'>
//         <div className='text-center text-slate-400 space-y-3'>
//           <p className='text-lg font-semibold'>No Object Selected</p>
//           <p>
//             Select an object in the scene to view its properties, or add a new
//             one.
//           </p>
//           <div className='space-y-3 w-full max-w-xs mx-auto'>
//             {" "}
//             {/* Added mx-auto for centering */}
//             <Button onClick={() => addShape("box")} className='w-full'>
//               🧊 Add Cube
//             </Button>
//             <Button
//               onClick={() => addShape("text")}
//               variant='outline'
//               className='w-full'
//             >
//               📝 Add 3D Text
//             </Button>
//           </div>
//           <div className='mt-6 pt-6 border-t border-slate-700'>
//             <ForceRefreshButton
//               onRefresh={forceRefreshCanvas}
//               className='w-full'
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ... (rest of your PropertiesPanel logic for when a shape IS selected)
//   // You might also want to place the ForceRefreshButton somewhere visible
//   // even when a shape is selected, e.g., at the very top of the panel.

//   return (
//     <div className='w-80 bg-slate-800 p-4 space-y-4 overflow-y-auto text-sm border-l border-border/60 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'>
//       <div className='flex justify-between items-center pb-2 border-b border-slate-700 mb-3'>
//         <h2 className='text-lg font-semibold text-slate-200'>Properties</h2>
//         <ForceRefreshButton onRefresh={forceRefreshCanvas} />{" "}
//         {/* Example placement */}
//       </div>

//       {/* Name Input */}
//       <div className='space-y-1'>
//         <label
//           htmlFor='shapeName'
//           className='text-xs font-medium text-slate-400'
//         >
//           Name
//         </label>
//         <input
//           id='shapeName'
//           type='text'
//           value={selectedShape.name || ""}
//           onChange={(e) =>
//             updateShape(selectedShape.id, { name: e.target.value })
//           }
//           className='w-full bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 text-xs rounded-md p-2 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none'
//           placeholder='Enter shape name'
//         />
//       </div>

//       {/* ... ALL YOUR OTHER PROPERTY CONTROLS (Position, Rotation, Scale, Color, Material, Textures, etc.) ... */}
//       {/* Ensure they use selectedShape and updateShape correctly */}

//       {/* Action Buttons for selected shape */}
//       <div className='pt-4 space-y-2 border-t border-slate-700'>
//         <Button
//           onClick={duplicateShape}
//           variant='outline'
//           className='w-full text-xs'
//           disabled={!selectedShape}
//         >
//           Duplicate Selected
//         </Button>
//         <Button
//           onClick={() => removeShape(selectedShape.id)}
//           variant='destructive'
//           className='w-full text-xs'
//           disabled={!selectedShape}
//         >
//           Delete Selected
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PropertiesPanel;

// components/3d/Create/PropertiesPanel.jsx
import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  X,
  Package,
  ImageIcon,
} from "lucide-react";
import * as THREE from "three";
import ForceRefreshButton from "./ForceRefreshButton"; // IMPORT THE NEW BUTTON

const initialTextureProps = {
  mapUrl: null,
  normalMapUrl: null,
  roughnessMapUrl: null,
  metalnessMapUrl: null,
  aoMapUrl: null,
  emissiveMapUrl: null,
};

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
  forceRefreshCanvas, // <<< RECEIVE THE NEW PROP
}) {
  const shapeDisplayOptions = [
    { name: "Cube", type: "box", icon: "🧊" },
    { name: "Sphere", type: "sphere", icon: "⚪" },
    { name: "Cylinder", type: "cylinder", icon: "🥫" },
    { name: "Cone", type: "cone", icon: "🔺" },
    { name: "Torus", type: "torus", icon: "🍩" },
    { name: "Pyramid", type: "pyramid", icon: "🔺" },
    { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
    { name: "Image Plane", type: "imagePlane", icon: <ImageIcon size={18} /> },
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
      if (isNaN(value) && property !== "rotation") return; // Allow empty or non-numeric for rotation if it resets to 0
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

  const allTextureSlots = [
    { id: "map", name: "Base Color (Albedo)" },
    { id: "normalMap", name: "Normal Map" },
    { id: "roughnessMap", name: "Roughness Map" },
    { id: "metalnessMap", name: "Metalness Map" },
    { id: "aoMap", name: "AO Map" },
    { id: "emissiveMap", name: "Emissive Map" },
  ];

  let activeTextureSlots = [];
  let currentTextureValues = initialTextureProps;
  let fileInputRefsToUse = shapeTextureFileInputRefs;
  let texturePropsKeyForShape = "textureProps";

  if (isText) {
    activeTextureSlots = [
      { id: "map", name: "Color/Albedo Map" },
      { id: "normalMap", name: "Normal Map" },
    ];
    currentTextureValues =
      selectedShape?.textTextureProps || initialTextureProps;
    fileInputRefsToUse = textTextureFileInputRefs;
    texturePropsKeyForShape = "textTextureProps";
  } else if (isImportedGLB) {
    activeTextureSlots = allTextureSlots;
    currentTextureValues = selectedShape?.textureProps || initialTextureProps;
    fileInputRefsToUse = shapeTextureFileInputRefs;
    texturePropsKeyForShape = "textureProps";
  } else if (!isImagePlane) {
    activeTextureSlots = allTextureSlots;
    currentTextureValues = selectedShape?.textureProps || initialTextureProps;
    fileInputRefsToUse = shapeTextureFileInputRefs;
    texturePropsKeyForShape = "textureProps";
  }

  const getShapeIcon = () => {
    if (!selectedShape) return "❓";
    const iconData = shapeDisplayOptions.find(
      (s) => s.type === currentShapeType
    );
    if (iconData)
      return typeof iconData.icon === "string" ? (
        <span className='text-2xl'>{iconData.icon}</span>
      ) : (
        iconData.icon
      );
    if (isCustomExtruded)
      return (
        <span className='text-2xl'>
          {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
        </span>
      );
    return <span className='text-2xl'>🔷</span>;
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className='w-80 p-6 bg-card/60 backdrop-blur-lg border-l border-border/60 overflow-y-auto shadow-2xl text-foreground scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'
    >
      <AnimatePresence mode='wait'>
        {selectedShape ? (
          <motion.div
            key={selectedShape.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-6'
          >
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-lg font-semibold'>Properties</h3>
                <p className='text-sm text-muted-foreground'>
                  Customize selected object
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <ForceRefreshButton
                  onRefresh={forceRefreshCanvas}
                  size='icon'
                  className='w-8 h-8'
                />{" "}
                {/* <<<< PLACEMENT EXAMPLE 1 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={duplicateShape}
                      variant='ghost'
                      size='icon'
                      className='w-8 h-8'
                    >
                      <LayersIconLucide size={16} />
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
                      className='w-8 h-8 text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete (Del/Backspace)</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator />

            {/* ... Rest of your existing selectedShape UI ... */}
            <Card className='bg-background/50'>
              <CardContent className='p-4'>
                <div className='text-xs text-muted-foreground mb-1'>
                  Selected Object
                </div>
                <div className='text-lg font-medium capitalize flex items-center space-x-2 truncate'>
                  {getShapeIcon()}
                  <span
                    className='truncate'
                    title={selectedShape.name || currentShapeType}
                  >
                    {selectedShape.name ||
                      (isText ? "3D Text" : currentShapeType)}
                  </span>
                </div>
                {isText && (
                  <p className='text-xs text-muted-foreground mt-1 truncate'>
                    "{selectedShape.text || "Empty"}"
                  </p>
                )}
                {isImagePlane && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Dims: {selectedShape.originalWidth}x
                    {selectedShape.originalHeight}px
                  </p>
                )}
              </CardContent>
            </Card>

            {isText && (
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-base'>Text Settings</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='text-content'>Content</Label>
                    <Input
                      id='text-content'
                      value={selectedShape.text || ""}
                      onChange={(e) =>
                        handleGenericUpdate("text", e.target.value)
                      }
                      placeholder='Enter text...'
                      className='mt-1'
                    />
                  </div>
                  <div>
                    <Label>
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
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label>
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
                      className='mt-2'
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {isCustomExtruded && (
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-base'>Custom Shape</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label>
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
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label>
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
                      className='mt-2'
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className='bg-background/50'>
              <CardHeader>
                <CardTitle className='text-base'>Transform</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {["position", "rotation", "scale"].map((prop) => (
                  <div key={prop} className='space-y-2'>
                    <h4 className='font-medium text-sm capitalize'>{prop}</h4>
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
                          className='col-span-2 h-8 text-xs'
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
                          className='col-span-3 mt-1'
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {!isImagePlane && (
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center'>
                    <Palette size={16} className='mr-2 text-purple-400' />{" "}
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {isImportedGLB ? (
                    <>
                      <p className='text-xs text-muted-foreground'>
                        Override the model's embedded materials. Changes apply
                        to all meshes.
                      </p>
                      <div>
                        <Label>Override Material Type</Label>
                        <Select
                          value={glbMaterialOverride?.type || "model"}
                          onValueChange={(newType) =>
                            handleGLBMaterialOverrideUpdate("type", newType)
                          }
                        >
                          <SelectTrigger className='mt-1'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='model'>
                              Use Model's Own Materials
                            </SelectItem>
                            {materialOptions.map((m) => (
                              <SelectItem key={m.type} value={m.type}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {glbMaterialOverride &&
                        glbMaterialOverride.type !== "model" && (
                          <>
                            <Separator className='my-3' />
                            <div>
                              <Label>Override Base Color</Label>
                              <div className='flex items-center space-x-2 mt-1'>
                                <Input
                                  type='color'
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className='p-1 h-10 w-14 rounded-md border cursor-pointer'
                                />
                                <Input
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className='flex-1 h-10'
                                />
                              </div>
                            </div>

                            {showPBRForGLBOverride && (
                              <>
                                <div>
                                  <Label>
                                    Override Roughness:{" "}
                                    {Number(
                                      glbMaterialOverride.roughness ?? 0.5
                                    ).toFixed(2)}
                                  </Label>
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
                                    className='mt-2'
                                  />
                                </div>
                                <div>
                                  <Label>
                                    Override Metalness:{" "}
                                    {Number(
                                      glbMaterialOverride.metalness ?? 0.0
                                    ).toFixed(2)}
                                  </Label>
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
                                    className='mt-2'
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                    </>
                  ) : (
                    <>
                      <div>
                        <Label>Material</Label>
                        <Select
                          value={selectedShape.material || "standard"}
                          onValueChange={(v) =>
                            handleGenericUpdate("material", v)
                          }
                        >
                          <SelectTrigger className='mt-1'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {materialOptions.map((m) => (
                              <SelectItem key={m.type} value={m.type}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Color</Label>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Input
                            type='color'
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className='p-1 h-10 w-14 rounded-md border cursor-pointer'
                          />
                          <Input
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className='flex-1 h-10'
                          />
                        </div>
                      </div>
                      {showPBRPropertiesForPrimitives && (
                        <>
                          <Separator className='my-3' />
                          <div>
                            <Label>
                              Roughness:{" "}
                              {Number(selectedShape.roughness || 0.5).toFixed(
                                2
                              )}
                            </Label>
                            <Slider
                              value={[selectedShape.roughness || 0.5]}
                              onValueChange={([v]) =>
                                handleGenericUpdate("roughness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className='mt-2'
                            />
                          </div>
                          <div>
                            <Label>
                              Metalness:{" "}
                              {Number(selectedShape.metalness || 0.0).toFixed(
                                2
                              )}
                            </Label>
                            <Slider
                              value={[selectedShape.metalness || 0.0]}
                              onValueChange={([v]) =>
                                handleGenericUpdate("metalness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className='mt-2'
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <Separator className='my-3' />
                  <h4 className='text-sm font-semibold text-purple-300 flex items-center'>
                    <ImageUp size={14} className='mr-1.5' />
                    {isText
                      ? "Text Textures"
                      : isImportedGLB
                      ? "Apply Textures to Override"
                      : "Shape Textures"}
                  </h4>
                  <div className='grid grid-cols-2 gap-3'>
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
                            className='text-xs'
                          >
                            {slot.name}
                          </Label>
                          {currentUrl && (
                            <div className='relative group w-full aspect-square bg-muted rounded overflow-hidden mb-1'>
                              <img
                                src={currentUrl}
                                alt={`${slot.name} preview`}
                                className='w-full h-full object-cover'
                              />
                              <Button
                                variant='destructive'
                                size='icon'
                                className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    isText
                                  )
                                }
                                title={`Clear ${slot.name}`}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          )}
                          <div className='flex items-center space-x-1'>
                            <Button
                              variant='outline'
                              size='xs'
                              className='w-full text-xs'
                              onClick={() => fileInputRef?.click()}
                            >
                              <ImageUp size={12} className='mr-1.5' />{" "}
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
                                    isText
                                  )
                                }
                                title={`Clear ${slot.name}`}
                                className='p-1 h-auto'
                              >
                                <X size={12} />
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

            <Card className='bg-background/50'>
              <CardHeader>
                <CardTitle className='text-base'>Animation</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={animation.type}
                    onValueChange={(v) => handleAnimationUpdate("type", v)}
                  >
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>None</SelectItem>
                      <SelectItem value='rotate'>Rotate</SelectItem>
                      <SelectItem value='orbit'>Orbit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {animation.type !== "none" && (
                  <>
                    <div>
                      <Label>Speed: {Number(animation.speed).toFixed(2)}</Label>
                      <Slider
                        value={[animation.speed]}
                        onValueChange={([v]) =>
                          handleAnimationUpdate("speed", v)
                        }
                        min={0.05}
                        max={5}
                        step={0.05}
                        className='mt-2'
                      />
                    </div>
                    {animation.type === "rotate" && (
                      <div>
                        <Label>Rotation Axis</Label>
                        <Select
                          value={animation.axis}
                          onValueChange={(v) =>
                            handleAnimationUpdate("axis", v)
                          }
                        >
                          <SelectTrigger className='mt-1'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='x'>X-Axis</SelectItem>
                            <SelectItem value='y'>Y-Axis</SelectItem>
                            <SelectItem value='z'>Z-Axis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {animation.type === "orbit" && (
                      <>
                        <div>
                          <Label>
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
                            className='mt-2'
                          />
                        </div>
                        <div>
                          <Label>Orbit Plane</Label>
                          <Select
                            value={animation.orbitPlane || "xz"}
                            onValueChange={(v) =>
                              handleAnimationUpdate("orbitPlane", v)
                            }
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='xy'>
                                XY Plane (Vertical)
                              </SelectItem>
                              <SelectItem value='xz'>
                                XZ Plane (Horizontal)
                              </SelectItem>
                              <SelectItem value='yz'>
                                YZ Plane (Side Vertical)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-1'>
                          <Label>Orbit Center</Label>
                          <div className='grid grid-cols-3 gap-2 items-center'>
                            {["X", "Y", "Z"].map((axisName, index) => (
                              <div key={axisName}>
                                <Label
                                  htmlFor={`orbit-center-${axisName}`}
                                  className='text-xs'
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
                                  className='h-8 text-xs mt-0.5'
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

            <Card className='bg-background/50'>
              <CardHeader>
                <CardTitle className='text-base'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    onClick={() => handleQuickAction("resetScale")}
                    variant='outline'
                    size='sm'
                  >
                    Reset Scale
                  </Button>
                  <Button
                    onClick={() => handleQuickAction("resetRotation")}
                    variant='outline'
                    size='sm'
                  >
                    Reset Rotation
                  </Button>
                  <Button
                    onClick={() => handleQuickAction("centerObject")}
                    variant='outline'
                    size='sm'
                  >
                    Center Object
                  </Button>
                  {!isImagePlane && (
                    <Button
                      onClick={() => handleQuickAction("randomColor")}
                      variant='outline'
                      size='sm'
                    >
                      Random Color
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key='empty'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col items-center justify-center h-full text-center'
          >
            <div className='text-6xl mb-6'>✨</div>
            <h3 className='text-xl font-semibold mb-2'>No Object Selected</h3>
            <p className='text-muted-foreground mb-6 leading-relaxed px-4'>
              Click an object, or add/import one.
            </p>
            <div className='space-y-3 w-full max-w-xs'>
              <Button onClick={() => addShape("box")} className='w-full'>
                🧊 Add Cube
              </Button>
              <Button
                onClick={() => addShape("text")}
                variant='outline'
                className='w-full'
              >
                📝 Add 3D Text
              </Button>
            </div>
            <div className='mt-8 pt-6 border-t border-slate-700/50 w-full max-w-xs'>
              <ForceRefreshButton
                onRefresh={forceRefreshCanvas}
                className='w-full'
              />{" "}
              {/* <<<< PLACEMENT EXAMPLE 2 */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
