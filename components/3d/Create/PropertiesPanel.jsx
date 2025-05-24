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
import * as THREE from "three";

export default function PropertiesPanel({
  selectedShape,
  updateShape, // updateShapeAndSave from Model3DCreator
  removeShape,
  duplicateShape,
  addShape, // For "Add Cube" etc. buttons in empty state
}) {
  const shapeDisplayOptions = [
    { name: "Cube", type: "box", icon: "🧊" }, // Use 'type' to match shapeData
    { name: "Sphere", type: "sphere", icon: "⚪" },
    { name: "Cylinder", type: "cylinder", icon: "🥫" },
    { name: "Cone", type: "cone", icon: "🔺" },
    { name: "Torus", type: "torus", icon: "🍩" },
    { name: "Pyramid", type: "pyramid", icon: "🔺" },
    { name: "3D Text", type: "text", icon: "📝" },
  ];
  const popularShapeIcons = {
    // For customExtruded shapes
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
  const isPBRMaterial = ["standard", "physical"].includes(
    selectedShape?.material
  );
  const isCustomExtruded = currentShapeType === "customExtruded";
  const isImportedGLB = currentShapeType === "importedGLB";
  const isText = currentShapeType === "text";

  const handleTransformUpdate = useCallback(
    (property, index, valueStr) => {
      if (!selectedShape) return;
      const value = parseFloat(valueStr);
      if (isNaN(value) && property !== "rotation") return; // Allow NaN for rotation if input is cleared, will default to 0 later

      const newTransform = [...selectedShape[property]];
      newTransform[index] =
        property === "rotation"
          ? THREE.MathUtils.degToRad(value || 0) // Convert degrees to radians, default to 0 if NaN
          : Math.max(property === "scale" ? 0.01 : -Infinity, value); // Ensure scale is positive

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

  const handleAnimationUpdate = useCallback(
    (property, value) => {
      if (!selectedShape) return;
      const currentAnimation = selectedShape.animation || {
        type: "none",
        speed: 1,
        axis: "y",
        orbitCenter: [0, 0, 0],
        orbitRadius: 5,
        orbitPlane: "xz",
      };
      updateShape(selectedShape.id, {
        animation: { ...currentAnimation, [property]: value },
      });
    },
    [selectedShape, updateShape]
  );

  const handleOrbitCenterUpdate = useCallback(
    (index, valueStr) => {
      if (!selectedShape || !selectedShape.animation) return;
      const value = parseFloat(valueStr);
      if (isNaN(value)) return; // Or set to 0? For now, ignore if not a number.

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
          let yOffset = 0;
          if (selectedShape.scale && selectedShape.scale[1]) {
            if (selectedShape.type === "pyramid") yOffset = 0; // Base is at 0
            else if (selectedShape.type === "importedGLB") {
              // Centering imported GLB is complex, depends on its internal origin
              // For now, just center its bounding box origin if we could get it.
              // Or simply set Y to 0.
              yOffset = 0;
            } else yOffset = selectedShape.scale[1] * 0.5; // Most shapes centered around origin
          }
          updateShape(selectedShape.id, { position: [0, yOffset, 0] });
        },
        randomColor: () => {
          if (isImportedGLB) {
            alert("Cannot apply random color to imported model directly.");
            return;
          }
          updateShape(selectedShape.id, {
            color: `#${Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")}`,
          });
        },
      };
      actions[action]?.();
    },
    [selectedShape, updateShape, isImportedGLB]
  );

  // Ensure animation object and its properties have defaults for rendering
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
                    {isImportedGLB
                      ? "📦"
                      : isCustomExtruded
                      ? popularShapeIcons[
                          selectedShape.shapeType?.toLowerCase()
                        ] || "💖"
                      : shapeDisplayOptions.find(
                          (s) => s.type === currentShapeType
                        )?.icon || "🔷"}
                  </span>
                  <span
                    className='truncate'
                    title={selectedShape.name || currentShapeType}
                  >
                    {isImportedGLB
                      ? selectedShape.name || "Imported Model"
                      : isText
                      ? `Text: "${selectedShape.text || "Empty"}"`
                      : isCustomExtruded && selectedShape.shapeType
                      ? selectedShape.shapeType
                      : selectedShape.name || currentShapeType}
                  </span>
                </div>
                {isImportedGLB && selectedShape.name && (
                  <div
                    className='text-xs text-muted-foreground mt-1 truncate'
                    title={selectedShape.name}
                  >
                    Filename: {selectedShape.name}
                  </div>
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
                          } // Slider passes number
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

            {!isImportedGLB && (
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-base'>Appearance</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label>Material</Label>
                    <Select
                      value={selectedShape.material || "standard"}
                      onValueChange={(v) => handleGenericUpdate("material", v)}
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
                  {isPBRMaterial && (
                    <>
                      <Separator className='my-3' />
                      <div>
                        <Label>
                          Roughness:{" "}
                          {selectedShape.roughness?.toFixed(2) || 0.5}
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
                          {selectedShape.metalness?.toFixed(2) || 0.0}
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
                </CardContent>
              </Card>
            )}
            {isImportedGLB && (
              <Card className='bg-background/50'>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Appearance (Imported)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Materials are part of the imported model. Edit materials
                    within your 3D modeling software for full control.
                  </p>
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
                  {!isImportedGLB && (
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
          <motion.div /* No Object Selected (empty state) */
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
                onClick={() =>
                  addShape("customExtruded", { shapeType: "heart" })
                }
                variant='outline'
                className='w-full'
              >
                ❤️ Add Heart
              </Button>
              {/* Consider adding an "Import GLB" button here too */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
