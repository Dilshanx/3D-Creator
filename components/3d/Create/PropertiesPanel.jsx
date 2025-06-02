// import React, { useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Separator } from "@/components/ui/separator";
// import {
//   ImageUp,
//   Trash2,
//   Palette,
//   LayersIcon as LayersIconLucide,
//   Type as TypeIcon,
//   X,
//   Package,
//   ImageIcon,
// } from "lucide-react";
// import * as THREE from "three";
// import ForceRefreshButton from "./ForceRefreshButton"; // IMPORT THE NEW BUTTON

// const initialTextureProps = {
//   mapUrl: null,
//   normalMapUrl: null,
//   roughnessMapUrl: null,
//   metalnessMapUrl: null,
//   aoMapUrl: null,
//   emissiveMapUrl: null,
// };

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
//   forceRefreshCanvas, // <<< RECEIVE THE NEW PROP
// }) {
//   const shapeDisplayOptions = [
//     { name: "Cube", type: "box", icon: "🧊" },
//     { name: "Sphere", type: "sphere", icon: "⚪" },
//     { name: "Cylinder", type: "cylinder", icon: "🥫" },
//     { name: "Cone", type: "cone", icon: "🔺" },
//     { name: "Torus", type: "torus", icon: "🍩" },
//     { name: "Pyramid", type: "pyramid", icon: "🔺" },
//     { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
//     { name: "Image Plane", type: "imagePlane", icon: <ImageIcon size={18} /> },
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
//   const materialOptions = [
//     { name: "Standard (PBR)", type: "standard" },
//     { name: "Physical (PBR)", type: "physical" },
//     { name: "Toon", type: "toon" },
//     { name: "Basic (Non-PBR)", type: "basic" },
//     { name: "Lambert (Non-PBR)", type: "lambert" },
//     { name: "Phong (Non-PBR)", type: "phong" },
//     { name: "Wireframe", type: "wireframe" },
//   ];

//   const currentShapeType = selectedShape?.type;
//   const isCustomExtruded = currentShapeType === "customExtruded";
//   const isImportedGLB = currentShapeType === "importedGLB";
//   const isText = currentShapeType === "text";
//   const isImagePlane = currentShapeType === "imagePlane";

//   const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;
//   const showPBRForGLBOverride =
//     glbMaterialOverride &&
//     ["standard", "physical"].includes(glbMaterialOverride.type);
//   const showPBRPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     ["standard", "physical"].includes(selectedShape.material);

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
//       if (isNaN(value) && property !== "rotation") return; // Allow empty or non-numeric for rotation if it resets to 0
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
//             newOverrideSettings.roughness = currentOverride.roughness ?? 0.5;
//             newOverrideSettings.metalness = currentOverride.metalness ?? 0.0;
//           } else {
//             delete newOverrideSettings.roughness;
//             delete newOverrideSettings.metalness;
//           }
//           if (value === "physical") {
//             newOverrideSettings.transmission =
//               currentOverride.transmission ?? 0.0;
//             newOverrideSettings.ior = currentOverride.ior ?? 1.5;
//             newOverrideSettings.thickness = currentOverride.thickness ?? 0.01;
//           } else {
//             delete newOverrideSettings.transmission;
//             delete newOverrideSettings.ior;
//             delete newOverrideSettings.thickness;
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

//   const allTextureSlots = [
//     { id: "map", name: "Base Color (Albedo)" },
//     { id: "normalMap", name: "Normal Map" },
//     { id: "roughnessMap", name: "Roughness Map" },
//     { id: "metalnessMap", name: "Metalness Map" },
//     { id: "aoMap", name: "AO Map" },
//     { id: "emissiveMap", name: "Emissive Map" },
//   ];

//   let activeTextureSlots = [];
//   let currentTextureValues = initialTextureProps;
//   let fileInputRefsToUse = shapeTextureFileInputRefs;
//   let texturePropsKeyForShape = "textureProps";

//   if (isText) {
//     activeTextureSlots = [
//       { id: "map", name: "Color/Albedo Map" },
//       { id: "normalMap", name: "Normal Map" },
//     ];
//     currentTextureValues =
//       selectedShape?.textTextureProps || initialTextureProps;
//     fileInputRefsToUse = textTextureFileInputRefs;
//     texturePropsKeyForShape = "textTextureProps";
//   } else if (isImportedGLB) {
//     activeTextureSlots = allTextureSlots;
//     currentTextureValues = selectedShape?.textureProps || initialTextureProps;
//     fileInputRefsToUse = shapeTextureFileInputRefs;
//     texturePropsKeyForShape = "textureProps";
//   } else if (!isImagePlane) {
//     activeTextureSlots = allTextureSlots;
//     currentTextureValues = selectedShape?.textureProps || initialTextureProps;
//     fileInputRefsToUse = shapeTextureFileInputRefs;
//     texturePropsKeyForShape = "textureProps";
//   }

//   const getShapeIcon = () => {
//     if (!selectedShape) return "❓";
//     const iconData = shapeDisplayOptions.find(
//       (s) => s.type === currentShapeType
//     );
//     if (iconData)
//       return typeof iconData.icon === "string" ? (
//         <span className='text-2xl'>{iconData.icon}</span>
//       ) : (
//         iconData.icon
//       );
//     if (isCustomExtruded)
//       return (
//         <span className='text-2xl'>
//           {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
//         </span>
//       );
//     return <span className='text-2xl'>🔷</span>;
//   };

//   return (
//     <motion.div
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ delay: 0.3 }}
//       className='w-80 p-6 bg-card/60 backdrop-blur-lg border-l border-border/60 overflow-y-auto shadow-2xl text-foreground scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'
//     >
//       <AnimatePresence mode='wait'>
//         {selectedShape ? (
//           <motion.div
//             key={selectedShape.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className='space-y-6'
//           >
//             <div className='flex justify-between items-center'>
//               <div>
//                 <h3 className='text-lg font-semibold'>Properties</h3>
//                 <p className='text-sm text-muted-foreground'>
//                   Customize selected object
//                 </p>
//               </div>
//               <div className='flex items-center space-x-1'>
//                 <ForceRefreshButton
//                   onRefresh={forceRefreshCanvas}
//                   size='icon'
//                   className='w-8 h-8'
//                 />{" "}
//                 {/* <<<< PLACEMENT EXAMPLE 1 */}
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={duplicateShape}
//                       variant='ghost'
//                       size='icon'
//                       className='w-8 h-8'
//                     >
//                       <LayersIconLucide size={16} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Duplicate (Ctrl+D)</TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={() => removeShape(selectedShape.id)}
//                       variant='ghost'
//                       size='icon'
//                       className='w-8 h-8 text-destructive hover:bg-destructive/10'
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete (Del/Backspace)</TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>
//             <Separator />

//             {/* ... Rest of your existing selectedShape UI ... */}
//             <Card className='bg-background/50'>
//               <CardContent className='p-4'>
//                 <div className='text-xs text-muted-foreground mb-1'>
//                   Selected Object
//                 </div>
//                 <div className='text-lg font-medium capitalize flex items-center space-x-2 truncate'>
//                   {getShapeIcon()}
//                   <span
//                     className='truncate'
//                     title={selectedShape.name || currentShapeType}
//                   >
//                     {selectedShape.name ||
//                       (isText ? "3D Text" : currentShapeType)}
//                   </span>
//                 </div>
//                 {isText && (
//                   <p className='text-xs text-muted-foreground mt-1 truncate'>
//                     "{selectedShape.text || "Empty"}"
//                   </p>
//                 )}
//                 {isImagePlane && (
//                   <p className='text-xs text-muted-foreground mt-1'>
//                     Dims: {selectedShape.originalWidth}x
//                     {selectedShape.originalHeight}px
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {isText && (
//               <Card className='bg-background/50'>
//                 <CardHeader>
//                   <CardTitle className='text-base'>Text Settings</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div>
//                     <Label htmlFor='text-content'>Content</Label>
//                     <Input
//                       id='text-content'
//                       value={selectedShape.text || ""}
//                       onChange={(e) =>
//                         handleGenericUpdate("text", e.target.value)
//                       }
//                       placeholder='Enter text...'
//                       className='mt-1'
//                     />
//                   </div>
//                   <div>
//                     <Label>
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
//                       className='mt-2'
//                     />
//                   </div>
//                   <div>
//                     <Label>
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
//                       className='mt-2'
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {isCustomExtruded && (
//               <Card className='bg-background/50'>
//                 <CardHeader>
//                   <CardTitle className='text-base'>Custom Shape</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div>
//                     <Label>
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
//                       className='mt-2'
//                     />
//                   </div>
//                   <div>
//                     <Label>
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
//                       className='mt-2'
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className='bg-background/50'>
//               <CardHeader>
//                 <CardTitle className='text-base'>Transform</CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 {["position", "rotation", "scale"].map((prop) => (
//                   <div key={prop} className='space-y-2'>
//                     <h4 className='font-medium text-sm capitalize'>{prop}</h4>
//                     {["X", "Y", "Z"].map((axis, index) => (
//                       <div
//                         key={axis}
//                         className='grid grid-cols-6 items-center gap-2'
//                       >
//                         <Label
//                           htmlFor={`${prop}-${axis}`}
//                           className='text-xs col-span-1'
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
//                           className='col-span-2 h-8 text-xs'
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
//                           className='col-span-3 mt-1'
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {!isImagePlane && (
//               <Card className='bg-background/50'>
//                 <CardHeader>
//                   <CardTitle className='text-base flex items-center'>
//                     <Palette size={16} className='mr-2 text-purple-400' />{" "}
//                     Appearance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   {isImportedGLB ? (
//                     <>
//                       <p className='text-xs text-muted-foreground'>
//                         Override the model's embedded materials. Changes apply
//                         to all meshes.
//                       </p>
//                       <div>
//                         <Label>Override Material Type</Label>
//                         <Select
//                           value={glbMaterialOverride?.type || "model"}
//                           onValueChange={(newType) =>
//                             handleGLBMaterialOverrideUpdate("type", newType)
//                           }
//                         >
//                           <SelectTrigger className='mt-1'>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value='model'>
//                               Use Model's Own Materials
//                             </SelectItem>
//                             {materialOptions.map((m) => (
//                               <SelectItem key={m.type} value={m.type}>
//                                 {m.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {glbMaterialOverride &&
//                         glbMaterialOverride.type !== "model" && (
//                           <>
//                             <Separator className='my-3' />
//                             <div>
//                               <Label>Override Base Color</Label>
//                               <div className='flex items-center space-x-2 mt-1'>
//                                 <Input
//                                   type='color'
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className='p-1 h-10 w-14 rounded-md border cursor-pointer'
//                                 />
//                                 <Input
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className='flex-1 h-10'
//                                 />
//                               </div>
//                             </div>

//                             {showPBRForGLBOverride && (
//                               <>
//                                 <div>
//                                   <Label>
//                                     Override Roughness:{" "}
//                                     {Number(
//                                       glbMaterialOverride.roughness ?? 0.5
//                                     ).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[
//                                       glbMaterialOverride.roughness ?? 0.5,
//                                     ]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "roughness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className='mt-2'
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label>
//                                     Override Metalness:{" "}
//                                     {Number(
//                                       glbMaterialOverride.metalness ?? 0.0
//                                     ).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[
//                                       glbMaterialOverride.metalness ?? 0.0,
//                                     ]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "metalness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className='mt-2'
//                                   />
//                                 </div>
//                               </>
//                             )}
//                           </>
//                         )}
//                     </>
//                   ) : (
//                     <>
//                       <div>
//                         <Label>Material</Label>
//                         <Select
//                           value={selectedShape.material || "standard"}
//                           onValueChange={(v) =>
//                             handleGenericUpdate("material", v)
//                           }
//                         >
//                           <SelectTrigger className='mt-1'>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {materialOptions.map((m) => (
//                               <SelectItem key={m.type} value={m.type}>
//                                 {m.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div>
//                         <Label>Color</Label>
//                         <div className='flex items-center space-x-2 mt-1'>
//                           <Input
//                             type='color'
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className='p-1 h-10 w-14 rounded-md border cursor-pointer'
//                           />
//                           <Input
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className='flex-1 h-10'
//                           />
//                         </div>
//                       </div>
//                       {showPBRPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-3' />
//                           <div>
//                             <Label>
//                               Roughness:{" "}
//                               {Number(selectedShape.roughness || 0.5).toFixed(
//                                 2
//                               )}
//                             </Label>
//                             <Slider
//                               value={[selectedShape.roughness || 0.5]}
//                               onValueChange={([v]) =>
//                                 handleGenericUpdate("roughness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className='mt-2'
//                             />
//                           </div>
//                           <div>
//                             <Label>
//                               Metalness:{" "}
//                               {Number(selectedShape.metalness || 0.0).toFixed(
//                                 2
//                               )}
//                             </Label>
//                             <Slider
//                               value={[selectedShape.metalness || 0.0]}
//                               onValueChange={([v]) =>
//                                 handleGenericUpdate("metalness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className='mt-2'
//                             />
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )}

//                   <Separator className='my-3' />
//                   <h4 className='text-sm font-semibold text-purple-300 flex items-center'>
//                     <ImageUp size={14} className='mr-1.5' />
//                     {isText
//                       ? "Text Textures"
//                       : isImportedGLB
//                       ? "Apply Textures to Override"
//                       : "Shape Textures"}
//                   </h4>
//                   <div className='grid grid-cols-2 gap-3'>
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
//                             className='text-xs'
//                           >
//                             {slot.name}
//                           </Label>
//                           {currentUrl && (
//                             <div className='relative group w-full aspect-square bg-muted rounded overflow-hidden mb-1'>
//                               <img
//                                 src={currentUrl}
//                                 alt={`${slot.name} preview`}
//                                 className='w-full h-full object-cover'
//                               />
//                               <Button
//                                 variant='destructive'
//                                 size='icon'
//                                 className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
//                                 onClick={() =>
//                                   handleClearTexture(
//                                     selectedShape.id,
//                                     slot.id,
//                                     isText
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                               >
//                                 <Trash2 size={12} />
//                               </Button>
//                             </div>
//                           )}
//                           <div className='flex items-center space-x-1'>
//                             <Button
//                               variant='outline'
//                               size='xs'
//                               className='w-full text-xs'
//                               onClick={() => fileInputRef?.click()}
//                             >
//                               <ImageUp size={12} className='mr-1.5' />{" "}
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
//                                     isText
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                                 className='p-1 h-auto'
//                               >
//                                 <X size={12} />
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

//             <Card className='bg-background/50'>
//               <CardHeader>
//                 <CardTitle className='text-base'>Animation</CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 <div>
//                   <Label>Type</Label>
//                   <Select
//                     value={animation.type}
//                     onValueChange={(v) => handleAnimationUpdate("type", v)}
//                   >
//                     <SelectTrigger className='mt-1'>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value='none'>None</SelectItem>
//                       <SelectItem value='rotate'>Rotate</SelectItem>
//                       <SelectItem value='orbit'>Orbit</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {animation.type !== "none" && (
//                   <>
//                     <div>
//                       <Label>Speed: {Number(animation.speed).toFixed(2)}</Label>
//                       <Slider
//                         value={[animation.speed]}
//                         onValueChange={([v]) =>
//                           handleAnimationUpdate("speed", v)
//                         }
//                         min={0.05}
//                         max={5}
//                         step={0.05}
//                         className='mt-2'
//                       />
//                     </div>
//                     {animation.type === "rotate" && (
//                       <div>
//                         <Label>Rotation Axis</Label>
//                         <Select
//                           value={animation.axis}
//                           onValueChange={(v) =>
//                             handleAnimationUpdate("axis", v)
//                           }
//                         >
//                           <SelectTrigger className='mt-1'>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value='x'>X-Axis</SelectItem>
//                             <SelectItem value='y'>Y-Axis</SelectItem>
//                             <SelectItem value='z'>Z-Axis</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     )}
//                     {animation.type === "orbit" && (
//                       <>
//                         <div>
//                           <Label>
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
//                             className='mt-2'
//                           />
//                         </div>
//                         <div>
//                           <Label>Orbit Plane</Label>
//                           <Select
//                             value={animation.orbitPlane || "xz"}
//                             onValueChange={(v) =>
//                               handleAnimationUpdate("orbitPlane", v)
//                             }
//                           >
//                             <SelectTrigger className='mt-1'>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value='xy'>
//                                 XY Plane (Vertical)
//                               </SelectItem>
//                               <SelectItem value='xz'>
//                                 XZ Plane (Horizontal)
//                               </SelectItem>
//                               <SelectItem value='yz'>
//                                 YZ Plane (Side Vertical)
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className='space-y-1'>
//                           <Label>Orbit Center</Label>
//                           <div className='grid grid-cols-3 gap-2 items-center'>
//                             {["X", "Y", "Z"].map((axisName, index) => (
//                               <div key={axisName}>
//                                 <Label
//                                   htmlFor={`orbit-center-${axisName}`}
//                                   className='text-xs'
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
//                                   className='h-8 text-xs mt-0.5'
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

//             <Card className='bg-background/50'>
//               <CardHeader>
//                 <CardTitle className='text-base'>Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className='grid grid-cols-2 gap-2'>
//                   <Button
//                     onClick={() => handleQuickAction("resetScale")}
//                     variant='outline'
//                     size='sm'
//                   >
//                     Reset Scale
//                   </Button>
//                   <Button
//                     onClick={() => handleQuickAction("resetRotation")}
//                     variant='outline'
//                     size='sm'
//                   >
//                     Reset Rotation
//                   </Button>
//                   <Button
//                     onClick={() => handleQuickAction("centerObject")}
//                     variant='outline'
//                     size='sm'
//                   >
//                     Center Object
//                   </Button>
//                   {!isImagePlane && (
//                     <Button
//                       onClick={() => handleQuickAction("randomColor")}
//                       variant='outline'
//                       size='sm'
//                     >
//                       Random Color
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ) : (
//           <motion.div
//             key='empty'
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className='flex flex-col items-center justify-center h-full text-center'
//           >
//             <div className='text-6xl mb-6'>✨</div>
//             <h3 className='text-xl font-semibold mb-2'>No Object Selected</h3>
//             <p className='text-muted-foreground mb-6 leading-relaxed px-4'>
//               Click an object, or add/import one.
//             </p>
//             <div className='space-y-3 w-full max-w-xs'>
//               <Button onClick={() => addShape("box")} className='w-full'>
//                 🧊 Add Cube
//               </Button>
//               <Button
//                 onClick={() => addShape("text")}
//                 variant='outline'
//                 className='w-full'
//               >
//                 📝 Add 3D Text
//               </Button>
//             </div>
//             <div className='mt-8 pt-6 border-t border-slate-700/50 w-full max-w-xs'>
//               <ForceRefreshButton
//                 onRefresh={forceRefreshCanvas}
//                 className='w-full'
//               />{" "}
//               {/* <<<< PLACEMENT EXAMPLE 2 */}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Trash2, Copy, RefreshCw, UploadCloud, XCircle } from "lucide-react";

const initialTextureProps = {
  /* Define if not imported from Model3DCreator directly */ mapUrl: null,
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
  forceRefreshCanvas,
  handleTextureUpload,
  handleClearTexture,
  shapeTextureFileInputRefs, // Refs to hidden file inputs
  textTextureFileInputRefs,
}) {
  if (!selectedShape) {
    return (
      <ScrollArea className='w-80 bg-card/60 backdrop-blur-lg border-l border-border/60 shadow-2xl'>
        <div className='p-4 space-y-4'>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>Properties</CardTitle>
              <CardDescription className='text-xs'>
                No shape selected.
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <p className='text-sm text-muted-foreground'>
                Select an object in the scene or add a new one from the sidebar.
              </p>
            </CardContent>
          </Card>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>Utilities</CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <Button
                onClick={forceRefreshCanvas}
                variant='outline'
                size='sm'
                className='w-full'
              >
                <RefreshCw className='mr-2 h-4 w-4' /> Force Canvas Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  const {
    id,
    type,
    name,
    position,
    rotation,
    scale,
    color,
    roughness,
    metalness,
    animation,
    text,
    textSize,
    extrudeDepth, // Text props
    shapeType,
    shapeSize, // CustomExtruded props
    glbMaterialOverride, // GLB props
    textureProps,
    textTextureProps, // Texture props for primitives and GLBs
  } = selectedShape;

  const handleInputChange = (
    key,
    value,
    isNumeric = false,
    isArray = false,
    index = null
  ) => {
    let processedValue = isNumeric ? parseFloat(value) || 0 : value;
    if (isArray && index !== null) {
      const newArray = [...selectedShape[key]];
      newArray[index] = processedValue;
      processedValue = newArray;
    }
    updateShape(id, { [key]: processedValue });
  };

  const handleAnimationChange = (
    subKey,
    value,
    isNumeric = false,
    isArray = false,
    index = null
  ) => {
    let processedValue = isNumeric ? parseFloat(value) || 0 : value;
    if (isArray && index !== null && animation && animation[subKey]) {
      const newArray = [...animation[subKey]];
      newArray[index] = processedValue;
      processedValue = newArray;
    }
    updateShape(id, { animation: { ...animation, [subKey]: processedValue } });
  };

  const handleGlbMaterialOverrideChange = (key, value) => {
    updateShape(id, {
      glbMaterialOverride: {
        ...(glbMaterialOverride || { type: "model", color: "#cccccc" }),
        [key]: value,
      },
    });
  };

  const currentTextureProps = type === "text" ? textTextureProps : textureProps;
  const isTextShape = type === "text";
  const relevantTextureFileInputRefs = isTextShape
    ? textTextureFileInputRefs
    : shapeTextureFileInputRefs;

  const textureMapTypes = [
    { key: "map", label: "Color (Albedo)" },
    { key: "normalMap", label: "Normal" },
  ];
  if (type !== "text") {
    // Add PBR maps for non-text shapes
    textureMapTypes.push(
      { key: "roughnessMap", label: "Roughness" },
      { key: "metalnessMap", label: "Metalness" },
      { key: "aoMap", label: "Ambient Occlusion" },
      { key: "emissiveMap", label: "Emissive" }
    );
  }

  return (
    <ScrollArea className='w-80 bg-card/60 backdrop-blur-lg border-l border-border/60 shadow-2xl'>
      <div className='p-4 space-y-4'>
        <Card className='bg-background/50'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-base truncate' title={name || type}>
              {name || type}
            </CardTitle>
            <CardDescription className='text-xs'>
              ID: {id.slice(-6)} ({type})
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 space-y-3'>
            <div>
              <Label htmlFor={`name-${id}`} className='text-xs'>
                Name
              </Label>
              <Input
                id={`name-${id}`}
                value={name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className='h-8 text-xs'
              />
            </div>
            <div className='flex space-x-2'>
              <Button
                onClick={() => duplicateShape(id)}
                variant='outline'
                size='sm'
                className='flex-1 text-xs'
              >
                <Copy className='mr-1 h-3 w-3' />
                Duplicate
              </Button>
              <Button
                onClick={() => removeShape(id)}
                variant='destructive'
                size='sm'
                className='flex-1 text-xs'
              >
                <Trash2 className='mr-1 h-3 w-3' />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-background/50'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-base'>Transform</CardTitle>
          </CardHeader>
          <CardContent className='p-4 space-y-3'>
            {["position", "rotation", "scale"].map((key) => (
              <div key={key}>
                <Label className='text-xs capitalize'>{key}</Label>
                <div className='flex space-x-1 mt-1'>
                  {selectedShape[key].map((val, i) => (
                    <Input
                      key={i}
                      type='number'
                      step={key === "rotation" ? 0.01 : 0.1}
                      value={val}
                      onChange={(e) =>
                        handleInputChange(key, e.target.value, true, true, i)
                      }
                      className='h-8 text-xs w-1/3'
                    />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {type === "text" && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>Text Properties</CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              <div>
                <Label htmlFor={`text-content-${id}`} className='text-xs'>
                  Content
                </Label>
                <Input
                  id={`text-content-${id}`}
                  value={text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  className='h-8 text-xs'
                />
              </div>
              <div>
                <Label htmlFor={`text-size-${id}`} className='text-xs'>
                  Size ({textSize?.toFixed(2)})
                </Label>
                <Slider
                  id={`text-size-${id}`}
                  value={[textSize || 0.5]}
                  onValueChange={([v]) => handleInputChange("textSize", v)}
                  min={0.1}
                  max={5}
                  step={0.01}
                />
              </div>
              <div>
                <Label htmlFor={`text-depth-${id}`} className='text-xs'>
                  Depth ({extrudeDepth?.toFixed(2)})
                </Label>
                <Slider
                  id={`text-depth-${id}`}
                  value={[extrudeDepth || 0.1]}
                  onValueChange={([v]) => handleInputChange("extrudeDepth", v)}
                  min={0.01}
                  max={2}
                  step={0.01}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {type === "customExtruded" && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>Shape Properties</CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              {/* Shape type could be a select if more options added dynamically */}
              <div>
                <Label className='text-xs'>Shape Type: {shapeType}</Label>
              </div>
              <div>
                <Label htmlFor={`shape-size-${id}`} className='text-xs'>
                  Size ({shapeSize?.toFixed(2)})
                </Label>
                <Slider
                  id={`shape-size-${id}`}
                  value={[shapeSize || 1]}
                  onValueChange={([v]) => handleInputChange("shapeSize", v)}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
              <div>
                <Label htmlFor={`shape-depth-${id}`} className='text-xs'>
                  Depth ({extrudeDepth?.toFixed(2)})
                </Label>
                <Slider
                  id={`shape-depth-${id}`}
                  value={[extrudeDepth || 0.2]}
                  onValueChange={([v]) => handleInputChange("extrudeDepth", v)}
                  min={0.01}
                  max={2}
                  step={0.01}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {type !== "imagePlane" && type !== "importedGLB" && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>
                Material (Primitive/Text)
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              <div>
                <Label htmlFor={`color-${id}`} className='text-xs'>
                  Color
                </Label>
                <Input
                  id={`color-${id}`}
                  type='color'
                  value={color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className='h-8'
                />
              </div>
              <div>
                <Label htmlFor={`roughness-${id}`} className='text-xs'>
                  Roughness ({roughness?.toFixed(2)})
                </Label>
                <Slider
                  id={`roughness-${id}`}
                  value={[roughness || 0.5]}
                  onValueChange={([v]) => handleInputChange("roughness", v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div>
                <Label htmlFor={`metalness-${id}`} className='text-xs'>
                  Metalness ({metalness?.toFixed(2)})
                </Label>
                <Slider
                  id={`metalness-${id}`}
                  value={[metalness || 0]}
                  onValueChange={([v]) => handleInputChange("metalness", v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {type === "importedGLB" && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>GLB Material Override</CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              <div>
                <Label htmlFor={`glb-material-type-${id}`} className='text-xs'>
                  Override Type
                </Label>
                <Select
                  value={glbMaterialOverride?.type || "model"}
                  onValueChange={(v) =>
                    handleGlbMaterialOverrideChange("type", v)
                  }
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='model' className='text-xs'>
                      Model Default
                    </SelectItem>
                    <SelectItem value='standard' className='text-xs'>
                      Standard
                    </SelectItem>
                    <SelectItem value='physical' className='text-xs'>
                      Physical
                    </SelectItem>
                    <SelectItem value='toon' className='text-xs'>
                      Toon
                    </SelectItem>
                    <SelectItem value='basic' className='text-xs'>
                      Basic
                    </SelectItem>
                    <SelectItem value='lambert' className='text-xs'>
                      Lambert
                    </SelectItem>
                    <SelectItem value='phong' className='text-xs'>
                      Phong
                    </SelectItem>
                    <SelectItem value='wireframe' className='text-xs'>
                      Wireframe
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {glbMaterialOverride?.type &&
                glbMaterialOverride.type !== "model" && (
                  <>
                    <div>
                      <Label
                        htmlFor={`glb-override-color-${id}`}
                        className='text-xs'
                      >
                        Override Color
                      </Label>
                      <Input
                        id={`glb-override-color-${id}`}
                        type='color'
                        value={glbMaterialOverride.color || "#cccccc"}
                        onChange={(e) =>
                          handleGlbMaterialOverrideChange(
                            "color",
                            e.target.value
                          )
                        }
                        className='h-8'
                      />
                    </div>
                    {(glbMaterialOverride.type === "standard" ||
                      glbMaterialOverride.type === "physical") && (
                      <>
                        <div>
                          <Label className='text-xs'>
                            Override Roughness (
                            {(glbMaterialOverride.roughness ?? 0.5).toFixed(2)})
                          </Label>
                          <Slider
                            value={[glbMaterialOverride.roughness ?? 0.5]}
                            onValueChange={([v]) =>
                              handleGlbMaterialOverrideChange("roughness", v)
                            }
                            min={0}
                            max={1}
                            step={0.01}
                          />
                        </div>
                        <div>
                          <Label className='text-xs'>
                            Override Metalness (
                            {(glbMaterialOverride.metalness ?? 0.0).toFixed(2)})
                          </Label>
                          <Slider
                            value={[glbMaterialOverride.metalness ?? 0.0]}
                            onValueChange={([v]) =>
                              handleGlbMaterialOverrideChange("metalness", v)
                            }
                            min={0}
                            max={1}
                            step={0.01}
                          />
                        </div>
                      </>
                    )}
                    {/* Add more physical props if type is physical */}
                  </>
                )}
            </CardContent>
          </Card>
        )}

        {/* Textures Section - For Primitives, Text, and GLBs */}
        {(type === "box" ||
          type === "sphere" ||
          type === "cylinder" ||
          type === "cone" ||
          type === "torus" ||
          type === "pyramid" ||
          type === "customExtruded" ||
          type === "text" ||
          type === "importedGLB") && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>Textures</CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              {textureMapTypes.map(
                (mapInfo) =>
                  (type !== "text" ||
                    mapInfo.key === "map" ||
                    mapInfo.key === "normalMap") && ( // Limit text textures
                    <div key={mapInfo.key}>
                      <Label className='text-xs'>{mapInfo.label}</Label>
                      <div className='flex items-center space-x-2 mt-1'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-xs flex-1'
                          onClick={() =>
                            relevantTextureFileInputRefs.current[
                              mapInfo.key
                            ]?.click()
                          }
                        >
                          <UploadCloud className='h-3 w-3 mr-1.5' />{" "}
                          {currentTextureProps?.[`${mapInfo.key}Url`]
                            ? "Change"
                            : "Upload"}
                        </Button>
                        {currentTextureProps?.[`${mapInfo.key}Url`] && (
                          <Button
                            variant='ghost'
                            size='icon_sm'
                            onClick={() =>
                              handleClearTexture(id, mapInfo.key, isTextShape)
                            }
                          >
                            <XCircle className='h-4 w-4 text-destructive' />
                          </Button>
                        )}
                      </div>
                      {currentTextureProps?.[`${mapInfo.key}Url`] && (
                        <p
                          className='text-xs text-muted-foreground truncate mt-1'
                          title={currentTextureProps[`${mapInfo.key}Url`]}
                        >
                          Loaded:{" "}
                          {currentTextureProps[`${mapInfo.key}Url`].substring(
                            0,
                            30
                          )}
                          ...
                        </p>
                      )}
                    </div>
                  )
              )}
            </CardContent>
          </Card>
        )}

        {/* Animation Section - For Primitives and Text */}
        {type !== "imagePlane" && type !== "importedGLB" && (
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base'>
                Animation (Procedural)
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
              <div>
                <Label htmlFor={`anim-type-${id}`} className='text-xs'>
                  Type
                </Label>
                <Select
                  value={animation?.type || "none"}
                  onValueChange={(v) => handleAnimationChange("type", v)}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none' className='text-xs'>
                      None
                    </SelectItem>
                    <SelectItem value='rotate' className='text-xs'>
                      Rotate
                    </SelectItem>
                    <SelectItem value='orbit' className='text-xs'>
                      Orbit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {animation?.type !== "none" && (
                <>
                  <div>
                    <Label className='text-xs'>
                      Speed ({(animation?.speed || 1).toFixed(2)})
                    </Label>
                    <Slider
                      value={[animation?.speed || 1]}
                      onValueChange={([v]) => handleAnimationChange("speed", v)}
                      min={0.1}
                      max={5}
                      step={0.1}
                    />
                  </div>
                  {animation?.type === "rotate" && (
                    <div>
                      <Label htmlFor={`anim-axis-${id}`} className='text-xs'>
                        Axis
                      </Label>
                      <Select
                        value={animation?.axis || "y"}
                        onValueChange={(v) => handleAnimationChange("axis", v)}
                      >
                        <SelectTrigger className='h-8 text-xs'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='x' className='text-xs'>
                            X
                          </SelectItem>
                          <SelectItem value='y' className='text-xs'>
                            Y
                          </SelectItem>
                          <SelectItem value='z' className='text-xs'>
                            Z
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {animation?.type === "orbit" && (
                    <>
                      <div>
                        <Label className='text-xs'>
                          Orbit Radius (
                          {(animation?.orbitRadius || 5).toFixed(1)})
                        </Label>
                        <Slider
                          value={[animation?.orbitRadius || 5]}
                          onValueChange={([v]) =>
                            handleAnimationChange("orbitRadius", v)
                          }
                          min={0}
                          max={10}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <Label className='text-xs'>Orbit Center</Label>
                        <div className='flex space-x-1 mt-1'>
                          {["X", "Y", "Z"].map((axisLabel, i) => (
                            <Input
                              key={i}
                              type='number'
                              step={0.1}
                              placeholder={axisLabel}
                              value={animation?.orbitCenter?.[i] || 0}
                              onChange={(e) =>
                                handleAnimationChange(
                                  "orbitCenter",
                                  e.target.value,
                                  true,
                                  true,
                                  i
                                )
                              }
                              className='h-8 text-xs w-1/3'
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor={`anim-orbit-plane-${id}`}
                          className='text-xs'
                        >
                          Orbit Plane
                        </Label>
                        <Select
                          value={animation?.orbitPlane || "xz"}
                          onValueChange={(v) =>
                            handleAnimationChange("orbitPlane", v)
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='xz' className='text-xs'>
                              XZ Plane
                            </SelectItem>
                            <SelectItem value='xy' className='text-xs'>
                              XY Plane
                            </SelectItem>
                            <SelectItem value='yz' className='text-xs'>
                              YZ Plane
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card className='bg-background/50'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-base'>Utilities</CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <Button
              onClick={forceRefreshCanvas}
              variant='outline'
              size='sm'
              className='w-full text-xs'
            >
              <RefreshCw className='mr-2 h-3 w-3' /> Force Canvas Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
