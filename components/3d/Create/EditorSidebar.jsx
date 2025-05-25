import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditorSidebar({
  mode,
  setMode,
  addShape,
  setCameraView,
  shapeOptions = [], // Default to an empty array from Model3DCreator
}) {
  const transformToolOptions = [
    {
      toolMode: "translate",
      icon: "↔️",
      label: "Translate",
      tooltip: "Move (W)",
    },
    { toolMode: "rotate", icon: "🔄", label: "Rotate", tooltip: "Rotate (E)" },
    { toolMode: "scale", icon: "📏", label: "Scale", tooltip: "Scale (R)" },
  ];

  const cameraViewOptions = [
    { name: "Top", preset: "top", icon: "⬆️" },
    { name: "Front", preset: "front", icon: "➡️" },
    { name: "Side", preset: "side", icon: "↗️" },
    { name: "Isometric", preset: "isometric", icon: "🎯" },
  ];

  const popularShapeOptions = [
    // These are for "customExtruded" type
    { name: "Heart", type: "heart", icon: "❤️" },
    { name: "Star", type: "star", icon: "⭐" },
    { name: "Crown", type: "crown", icon: "👑" },
    { name: "Lightning", type: "lightning", icon: "⚡" },
    { name: "Diamond", type: "diamond", icon: "💎" },
    { name: "Shield", type: "shield", icon: "🛡️" },
    { name: "Arrow", type: "arrow", icon: "➡️" },
    { name: "Leaf", type: "leaf", icon: "🍃" },
    { name: "Sword", type: "sword", icon: "⚔️" },
    { name: "Butterfly", type: "butterfly", icon: "🦋" },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className='w-80 p-6 bg-card/60 backdrop-blur-lg border-r border-border/60 overflow-y-auto shadow-2xl'
    >
      <Tabs defaultValue='tools' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='tools'>Tools</TabsTrigger>
          <TabsTrigger value='shapes'>Shapes</TabsTrigger>
          <TabsTrigger value='popular'>Popular</TabsTrigger>
          <TabsTrigger value='camera'>Camera</TabsTrigger>
        </TabsList>

        <TabsContent value='tools' className='space-y-6'>
          <Card className='bg-background/50'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>🛠️</span>
                <span>Transform Tools</span>
              </CardTitle>
              <CardDescription>
                Select how you want to manipulate objects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-3'>
                {transformToolOptions.map((tool) => (
                  <Tooltip key={tool.toolMode}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => setMode(tool.toolMode)}
                          variant={
                            mode === tool.toolMode ? "default" : "outline"
                          }
                          size='sm'
                          className='flex flex-col items-center justify-center h-16 w-full'
                        >
                          <span className='text-lg mb-1'>{tool.icon}</span>
                          <span className='text-xs capitalize'>
                            {tool.label}
                          </span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>{tool.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='shapes' className='space-y-6'>
          <Card className='bg-background/50'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>🧊</span>
                <span>Primitive Shapes</span>
              </CardTitle>
              <CardDescription>Click to add basic 3D objects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3'>
                {Array.isArray(shapeOptions) &&
                  shapeOptions.map(
                    (
                      shape // shapeOptions comes from Model3DCreator
                    ) => (
                      <Tooltip key={shape.name}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => addShape(shape.geometry)} // addShape uses geometry type string
                              variant='outline'
                              size='sm'
                              className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/10 transition-all'
                            >
                              <span className='text-xl mb-1'>{shape.icon}</span>
                              <span className='text-xs'>{shape.name}</span>
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Add {shape.name} to scene
                        </TooltipContent>
                      </Tooltip>
                    )
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='popular' className='space-y-6'>
          <Card className='bg-background/50'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>💖</span>
                <span>Popular Shapes</span>
              </CardTitle>
              <CardDescription>
                Add pre-designed 2D extruded shapes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3'>
                {popularShapeOptions.map((shape) => (
                  <Tooltip key={shape.name}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() =>
                            addShape("customExtruded", {
                              shapeType: shape.type,
                            })
                          }
                          variant='outline'
                          size='sm'
                          className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/10 transition-all'
                        >
                          <span className='text-xl mb-1'>{shape.icon}</span>
                          <span className='text-xs'>{shape.name}</span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>Add {shape.name} to scene</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='camera' className='space-y-6'>
          <Card className='bg-background/50'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>📷</span>
                <span>Camera Views</span>
              </CardTitle>
              <CardDescription>
                Quick camera positioning presets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3'>
                {cameraViewOptions.map((view) => (
                  <Tooltip key={view.preset}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => setCameraView(view.preset)}
                          variant='outline'
                          size='sm'
                          className='flex items-center justify-center space-x-2 w-full'
                        >
                          <span>{view.icon}</span>
                          <span className='text-xs'>{view.name}</span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>Switch to {view.name} view</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
