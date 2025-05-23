// PropertiesPanel.jsx;
// import { useState, useCallback } from "react"; // Keep useState if needed locally
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
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

// export default function PropertiesPanel({
//   selectedShape,
//   updateShape, // This is updateShapeAndSave from Model3DCreator
//   removeShape,
//   duplicateShape,
//   addShape,
// }) {
//   const shapeOptions = [
//     // For displaying primitive shape icons if needed, or for "Add Shape" in empty state
//     { name: "Cube", geometry: "box", icon: "🧊" },
//     { name: "Sphere", geometry: "sphere", icon: "⚪" },
//     { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
//     { name: "Cone", geometry: "cone", icon: "🔺" },
//     { name: "Torus", geometry: "torus", icon: "🍩" },
//     { name: "Pyramid", geometry: "pyramid", icon: "🔺" }, // Matched pyramid icon
//     { name: "3D Text", geometry: "text", icon: "📝" },
//   ];

//   const popularShapeIcons = {
//     // For displaying specific icons for popular shapes
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
//     { name: "Standard", type: "standard" },
//     { name: "Basic", type: "basic" },
//     { name: "Phong", type: "phong" },
//     { name: "Wireframe", type: "wireframe" },
//     { name: "Glass", type: "glass" },
//     { name: "Metal", type: "metal" },
//   ];

//   const handleTransformUpdate = useCallback(
//     (property, index, value) => {
//       if (!selectedShape) return;

//       const newTransform = [...selectedShape[property]];
//       newTransform[index] =
//         property === "rotation"
//           ? (value * Math.PI) / 180
//           : Math.max(property === "scale" ? 0.1 : -Infinity, value);
//       updateShape(selectedShape.id, { [property]: newTransform });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleQuickAction = useCallback(
//     (action) => {
//       if (!selectedShape) return;

//       const actions = {
//         resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
//         resetRotation: () =>
//           updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
//         centerObject: () =>
//           updateShape(selectedShape.id, {
//             position: [
//               0,
//               selectedShape.scale ? selectedShape.scale[1] / 2 : 0.5,
//               0,
//             ],
//           }), // Basic centering
//         randomColor: () =>
//           updateShape(selectedShape.id, {
//             color: `#${Math.floor(Math.random() * 16777215)
//               .toString(16)
//               .padStart(6, "0")}`,
//           }),
//       };

//       actions[action]?.();
//     },
//     [selectedShape, updateShape]
//   );

//   const isCustomExtruded = selectedShape?.geometry === "customExtruded";

//   return (
//     <motion.div
//       initial={{ x: 20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ delay: 0.3 }}
//       className='w-80 p-6 bg-card/50 backdrop-blur-sm border-l border-border/50 overflow-y-auto'
//     >
//       <AnimatePresence mode='wait'>
//         {selectedShape ? (
//           <motion.div
//             key='properties'
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className='space-y-6'
//           >
//             <div className='flex justify-between items-center'>
//               <div>
//                 <h3 className='text-lg font-semibold'>Properties</h3>
//                 <p className='text-sm text-muted-foreground'>
//                   Customize your selected object
//                 </p>
//               </div>
//               <div className='flex space-x-2'>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={duplicateShape}
//                       variant='outline'
//                       size='sm'
//                     >
//                       📋
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Duplicate object</TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={() => removeShape(selectedShape.id)}
//                       variant='outline'
//                       size='sm'
//                       className='text-destructive hover:bg-destructive/10'
//                     >
//                       🗑️
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete object</TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>

//             <Card>
//               <CardContent className='p-4'>
//                 <div className='text-sm text-muted-foreground mb-1'>
//                   Shape Type
//                 </div>
//                 <div className='text-lg font-medium capitalize flex items-center space-x-2'>
//                   <span>
//                     {isCustomExtruded
//                       ? popularShapeIcons[
//                           selectedShape.shapeType?.toLowerCase()
//                         ] || "💖"
//                       : shapeOptions.find(
//                           (s) => s.geometry === selectedShape.geometry
//                         )?.icon || "🔷"}
//                   </span>
//                   <span>
//                     {selectedShape.geometry === "text"
//                       ? "3D Text"
//                       : isCustomExtruded && selectedShape.shapeType
//                       ? selectedShape.shapeType
//                       : selectedShape.geometry}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>

//             {selectedShape.geometry === "text" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className='text-base'>Text Settings</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div>
//                     <Label htmlFor='text-content'>Text Content</Label>
//                     <Input
//                       id='text-content'
//                       value={selectedShape.text || ""}
//                       onChange={(e) =>
//                         updateShape(selectedShape.id, { text: e.target.value })
//                       }
//                       placeholder='Enter your text...'
//                       className='mt-1'
//                     />
//                   </div>
//                   <div>
//                     <Label>
//                       Text Size: {selectedShape.textSize?.toFixed(2) || 0.5}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.textSize || 0.5]}
//                       onValueChange={([value]) =>
//                         updateShape(selectedShape.id, { textSize: value })
//                       }
//                       max={2}
//                       min={0.1}
//                       step={0.1}
//                       className='mt-2'
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {isCustomExtruded && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className='text-base'>
//                     Custom Shape Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div>
//                     <Label>
//                       Shape Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.shapeSize || 1]}
//                       onValueChange={([value]) =>
//                         updateShape(selectedShape.id, { shapeSize: value })
//                       }
//                       max={3}
//                       min={0.1}
//                       step={0.1}
//                       className='mt-2'
//                     />
//                   </div>
//                   <div>
//                     <Label>
//                       Extrude Depth:{" "}
//                       {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.extrudeDepth || 0.2]}
//                       onValueChange={([value]) =>
//                         updateShape(selectedShape.id, { extrudeDepth: value })
//                       }
//                       max={1}
//                       min={0.05}
//                       step={0.05}
//                       className='mt-2'
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card>
//               <CardHeader>
//                 <CardTitle className='text-base'>Transform</CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-6'>
//                 <div className='space-y-3'>
//                   <h4 className='font-medium text-sm'>Position</h4>
//                   {["X", "Y", "Z"].map((axis, index) => (
//                     <div key={axis}>
//                       <Label className='text-xs'>
//                         {axis}: {selectedShape.position[index].toFixed(2)}
//                       </Label>
//                       <Slider
//                         value={[selectedShape.position[index]]}
//                         onValueChange={([value]) =>
//                           handleTransformUpdate("position", index, value)
//                         }
//                         max={10}
//                         min={-10}
//                         step={0.1}
//                         className='mt-1'
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <div className='space-y-3'>
//                   <h4 className='font-medium text-sm'>Rotation</h4>
//                   {["X", "Y", "Z"].map((axis, index) => (
//                     <div key={axis}>
//                       <Label className='text-xs'>
//                         {axis}:{" "}
//                         {(
//                           (selectedShape.rotation[index] * 180) /
//                           Math.PI
//                         ).toFixed(0)}
//                         °
//                       </Label>
//                       <Slider
//                         value={[
//                           (selectedShape.rotation[index] * 180) / Math.PI,
//                         ]}
//                         onValueChange={([degrees]) =>
//                           handleTransformUpdate("rotation", index, degrees)
//                         }
//                         max={180}
//                         min={-180}
//                         step={5}
//                         className='mt-1'
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <div className='space-y-3'>
//                   <h4 className='font-medium text-sm'>Scale</h4>
//                   {["X", "Y", "Z"].map((axis, index) => (
//                     <div key={axis}>
//                       <Label className='text-xs'>
//                         {axis}: {selectedShape.scale[index].toFixed(2)}
//                       </Label>
//                       <Slider
//                         value={[selectedShape.scale[index]]}
//                         onValueChange={([value]) =>
//                           handleTransformUpdate("scale", index, value)
//                         }
//                         max={3}
//                         min={0.1}
//                         step={0.1}
//                         className='mt-1'
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className='text-base'>Appearance</CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4'>
//                 <div>
//                   <Label>Material</Label>
//                   <Select
//                     value={selectedShape.material}
//                     onValueChange={(value) =>
//                       updateShape(selectedShape.id, { material: value })
//                     }
//                   >
//                     <SelectTrigger className='mt-1'>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {materialOptions.map((mat) => (
//                         <SelectItem key={mat.type} value={mat.type}>
//                           {mat.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Color</Label>
//                   <div className='flex items-center space-x-3 mt-1'>
//                     <input
//                       type='color'
//                       value={selectedShape.color}
//                       onChange={(e) =>
//                         updateShape(selectedShape.id, { color: e.target.value })
//                       }
//                       className='w-12 h-10 rounded-md border border-input cursor-pointer p-1 appearance-none bg-transparent'
//                       style={{ backgroundColor: selectedShape.color }}
//                     />
//                     <Input
//                       value={selectedShape.color}
//                       onChange={(e) =>
//                         updateShape(selectedShape.id, { color: e.target.value })
//                       }
//                       className='flex-1'
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
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
//                   <Button
//                     onClick={() => handleQuickAction("randomColor")}
//                     variant='outline'
//                     size='sm'
//                   >
//                     Random Color
//                   </Button>
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
//             <div className='text-6xl mb-6'>🎨</div>
//             <h3 className='text-xl font-semibold mb-4'>Create Your 3D Scene</h3>
//             <p className='text-muted-foreground mb-8 leading-relaxed'>
//               Select a shape to edit its properties or add new objects to get
//               started.
//             </p>
//             <div className='space-y-3 w-full'>
//               {/* Add shape buttons for empty state - could also include popular shapes here */}
//               <Button onClick={() => addShape("box")} className='w-full'>
//                 🧊 Add Cube
//               </Button>
//               <Button
//                 onClick={() =>
//                   addShape("customExtruded", { shapeType: "heart" })
//                 }
//                 variant='outline'
//                 className='w-full'
//               >
//                 ❤️ Add Heart
//               </Button>
//               <Button
//                 onClick={() => addShape("sphere")}
//                 variant='outline'
//                 className='w-full'
//               >
//                 ⚪ Add Sphere
//               </Button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// PropertiesPanel.jsx
import { useCallback } from "react";
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

export default function PropertiesPanel({
  selectedShape,
  updateShape, // This is updateShapeAndSave from Model3DCreator
  removeShape,
  duplicateShape,
  addShape,
}) {
  const shapeDisplayOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
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

  const currentMaterialType = selectedShape?.material || "standard";
  const isPBRMaterial = ["standard", "physical"].includes(currentMaterialType); // Removed "metal" as it's not a separate material type here

  const handleTransformUpdate = useCallback(
    (property, index, value) => {
      if (!selectedShape) return;
      const newTransform = [...selectedShape[property]];
      newTransform[index] =
        property === "rotation"
          ? (value * Math.PI) / 180
          : Math.max(
              property === "scale" ? 0.01 : -Infinity,
              parseFloat(value)
            );
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

  const handleQuickAction = useCallback(
    (action) => {
      if (!selectedShape) return;
      const actions = {
        resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
        resetRotation: () =>
          updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
        centerObject: () =>
          updateShape(selectedShape.id, {
            position: [
              0,
              selectedShape.scale
                ? selectedShape.scale[1] *
                  (selectedShape.geometry === "pyramid" ? 0 : 0.5)
                : 0.5,
              0,
            ],
          }),
        randomColor: () =>
          updateShape(selectedShape.id, {
            color: `#${Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")}`,
          }),
      };
      actions[action]?.();
    },
    [selectedShape, updateShape]
  );

  const isCustomExtruded = selectedShape?.geometry === "customExtruded";

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className='w-80 p-6 bg-card/60 backdrop-blur-lg border-l border-border/60 overflow-y-auto shadow-2xl'
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
              <div className='flex space-x-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={duplicateShape}
                      variant='ghost'
                      size='icon'
                      className='w-8 h-8'
                    >
                      📋
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
                      🗑️
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete (Del/Backspace)</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator />

            <Card className='bg-background/50'>
              <CardContent className='p-4'>
                <div className='text-xs text-muted-foreground mb-1'>
                  Selected Object
                </div>
                <div className='text-lg font-medium capitalize flex items-center space-x-2 truncate'>
                  <span className='text-xl'>
                    {isCustomExtruded
                      ? popularShapeIcons[
                          selectedShape.shapeType?.toLowerCase()
                        ] || "💖"
                      : shapeDisplayOptions.find(
                          (s) => s.geometry === selectedShape.geometry
                        )?.icon || "🔷"}
                  </span>
                  <span className='truncate'>
                    {selectedShape.geometry === "text"
                      ? `Text: "${selectedShape.text || "Empty"}"`
                      : isCustomExtruded && selectedShape.shapeType
                      ? selectedShape.shapeType
                      : selectedShape.geometry}
                  </span>
                </div>
              </CardContent>
            </Card>

            {selectedShape.geometry === "text" && (
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
                      onValueChange={([value]) =>
                        handleGenericUpdate("textSize", value)
                      }
                      max={2}
                      min={0.1}
                      step={0.05}
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
                      onValueChange={([value]) =>
                        handleGenericUpdate("shapeSize", value)
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
                      onValueChange={([value]) =>
                        handleGenericUpdate("extrudeDepth", value)
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
                {/* THIS IS THE CORRECTED LINE: */}
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
                              ? (
                                  (selectedShape[prop][index] * 180) /
                                  Math.PI
                                ).toFixed(0)
                              : selectedShape[prop][index].toFixed(2)
                          }
                          onChange={(e) =>
                            handleTransformUpdate(
                              prop,
                              index,
                              parseFloat(e.target.value)
                            )
                          }
                          step={prop === "rotation" ? 5 : 0.1}
                          className='col-span-2 h-8 text-xs'
                        />
                        <Slider
                          value={[
                            prop === "rotation"
                              ? (selectedShape[prop][index] * 180) / Math.PI
                              : selectedShape[prop][index],
                          ]}
                          onValueChange={([value]) =>
                            handleTransformUpdate(prop, index, value)
                          }
                          min={
                            prop === "rotation"
                              ? -180
                              : prop === "scale"
                              ? 0.01
                              : -10
                          }
                          max={
                            prop === "rotation"
                              ? 180
                              : prop === "scale"
                              ? 5
                              : 10
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

            <Card className='bg-background/50'>
              <CardHeader>
                <CardTitle className='text-base'>Appearance</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label>Material</Label>
                  <Select
                    value={currentMaterialType}
                    onValueChange={(value) =>
                      handleGenericUpdate("material", value)
                    }
                  >
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialOptions.map((mat) => (
                        <SelectItem key={mat.type} value={mat.type}>
                          {mat.name}
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
                      value={selectedShape.color}
                      onChange={(e) =>
                        handleGenericUpdate("color", e.target.value)
                      }
                      className='p-1 h-10 w-14 rounded-md border cursor-pointer'
                    />
                    <Input
                      value={selectedShape.color}
                      onChange={(e) =>
                        handleGenericUpdate("color", e.target.value)
                      }
                      className='flex-1 h-10'
                    />
                  </div>
                </div>

                {isPBRMaterial && (
                  <>
                    <Separator className='my-3' />
                    <div>
                      <Label>
                        Roughness: {selectedShape.roughness?.toFixed(2) || 0.5}
                      </Label>
                      <Slider
                        value={[selectedShape.roughness || 0.5]}
                        onValueChange={([value]) =>
                          handleGenericUpdate("roughness", value)
                        }
                        max={1}
                        min={0}
                        step={0.01}
                        className='mt-2'
                      />
                    </div>
                    <div>
                      <Label>
                        Metalness: {selectedShape.metalness?.toFixed(2) || 0.0}
                      </Label>
                      <Slider
                        value={[selectedShape.metalness || 0.0]}
                        onValueChange={([value]) =>
                          handleGenericUpdate("metalness", value)
                        }
                        max={1}
                        min={0}
                        step={0.01}
                        className='mt-2'
                      />
                    </div>
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
                  <Button
                    onClick={() => handleQuickAction("randomColor")}
                    variant='outline'
                    size='sm'
                  >
                    Random Color
                  </Button>
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
              Click an object in the scene to see its properties, or add a new
              one from the sidebar.
            </p>
            <div className='space-y-3 w-full max-w-xs'>
              <Button onClick={() => addShape("box")} className='w-full'>
                🧊 Add Cube
              </Button>
              <Button
                onClick={() =>
                  addShape("customExtruded", { shapeType: "heart" })
                }
                variant='outline'
                className='w-full'
              >
                ❤️ Add Heart
              </Button>
              <Button
                onClick={() => addShape("sphere")}
                variant='outline'
                className='w-full'
              >
                ⚪ Add Sphere
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
