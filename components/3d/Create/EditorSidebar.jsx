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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function EditorSidebar({
  mode,
  setMode,
  addShape,
  setCameraView,
  shapeOptions = [],
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
    // TooltipProvider should wrap the highest level component using tooltips,
    // or individual sections if preferred. Assuming it's at Model3DCreator level.
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
      className='w-72 p-4 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'
    >
      <Tabs defaultValue='tools' className='space-y-5'>
        <TabsList className='grid w-full grid-cols-4 gap-1 p-1 bg-slate-800/60 rounded-lg'>
          {["tools", "shapes", "popular", "camera"].map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "text-xs px-2 py-1.5 rounded-md transition-colors",
                "data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md",
                "data-[state=inactive]:text-slate-300 data-[state=inactive]:hover:bg-slate-700/70 data-[state=inactive]:hover:text-slate-100"
              )}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value='tools' className='space-y-5 outline-none'>
          <Card className='bg-slate-800/70 border border-slate-700 shadow-lg'>
            <CardHeader className='p-4'>
              <CardTitle className='text-base text-slate-100 flex items-center space-x-2'>
                <span className='text-lg'>🛠️</span>
                <span>Transform Tools</span>
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 pt-1'>
                Select object manipulation mode
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-3 gap-2'>
                {transformToolOptions.map((tool) => (
                  <Tooltip key={tool.toolMode}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          onClick={() => setMode(tool.toolMode)}
                          variant={
                            mode === tool.toolMode ? "default" : "outline"
                          }
                          size='sm'
                          className={cn(
                            "flex flex-col items-center justify-center h-16 w-full text-xs p-1",
                            mode === tool.toolMode
                              ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500 ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-800"
                              : "text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-100"
                          )}
                        >
                          <span className='text-xl mb-1'>{tool.icon}</span>
                          <span className='capitalize'>{tool.label}</span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      className='bg-slate-800 text-slate-200 border-slate-700'
                    >
                      <p>{tool.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='shapes' className='space-y-5 outline-none'>
          <Card className='bg-slate-800/70 border border-slate-700 shadow-lg'>
            <CardHeader className='p-4'>
              <CardTitle className='text-base text-slate-100 flex items-center space-x-2'>
                <span className='text-lg'>🧊</span>
                <span>Primitive Shapes</span>
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 pt-1'>
                Add basic 3D objects to the scene
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
                {Array.isArray(shapeOptions) &&
                  shapeOptions.map((shape) => (
                    <Tooltip key={shape.name}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            onClick={() => addShape(shape.geometry)}
                            variant='outline'
                            size='sm'
                            className='flex flex-col items-center justify-center h-20 w-full text-xs p-1 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-100'
                          >
                            <span className='text-2xl mb-1.5'>
                              {shape.icon}
                            </span>
                            <span>{shape.name}</span>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent
                        side='bottom'
                        className='bg-slate-800 text-slate-200 border-slate-700'
                      >
                        <p>Add {shape.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='popular' className='space-y-5 outline-none'>
          <Card className='bg-slate-800/70 border border-slate-700 shadow-lg'>
            <CardHeader className='p-4'>
              <CardTitle className='text-base text-slate-100 flex items-center space-x-2'>
                <span className='text-lg'>💖</span>
                <span>Popular 2D Extrusions</span>
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 pt-1'>
                Add pre-designed extruded shapes
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
                {popularShapeOptions.map((shape) => (
                  <Tooltip key={shape.name}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          onClick={() =>
                            addShape("customExtruded", {
                              shapeType: shape.type,
                            })
                          }
                          variant='outline'
                          size='sm'
                          className='flex flex-col items-center justify-center h-20 w-full text-xs p-1 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-100'
                        >
                          <span className='text-2xl mb-1.5'>{shape.icon}</span>
                          <span>{shape.name}</span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      className='bg-slate-800 text-slate-200 border-slate-700'
                    >
                      <p>Add {shape.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='camera' className='space-y-5 outline-none'>
          <Card className='bg-slate-800/70 border border-slate-700 shadow-lg'>
            <CardHeader className='p-4'>
              <CardTitle className='text-base text-slate-100 flex items-center space-x-2'>
                <span className='text-lg'>📷</span>
                <span>Camera Views</span>
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 pt-1'>
                Quick camera positioning presets
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
                {cameraViewOptions.map((view) => (
                  <Tooltip key={view.preset}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          onClick={() => setCameraView(view.preset)}
                          variant='outline'
                          size='sm'
                          className='flex items-center justify-center space-x-2 w-full h-12 text-xs text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-100'
                        >
                          <span className='text-lg'>{view.icon}</span>
                          <span>{view.name}</span>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      className='bg-slate-800 text-slate-200 border-slate-700'
                    >
                      <p>Switch to {view.name} view</p>
                    </TooltipContent>
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
