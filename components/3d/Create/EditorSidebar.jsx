// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// export default function EditorSidebar({
//   mode,
//   setMode,
//   addShape,
//   setCameraView,
//   shapeOptions = [], // Default to an empty array from Model3DCreator
// }) {
//   const transformToolOptions = [
//     {
//       toolMode: "translate",
//       icon: "↔️",
//       label: "Translate",
//       tooltip: "Move (W)",
//     },
//     { toolMode: "rotate", icon: "🔄", label: "Rotate", tooltip: "Rotate (E)" },
//     { toolMode: "scale", icon: "📏", label: "Scale", tooltip: "Scale (R)" },
//   ];

//   const cameraViewOptions = [
//     { name: "Top", preset: "top", icon: "⬆️" },
//     { name: "Front", preset: "front", icon: "➡️" },
//     { name: "Side", preset: "side", icon: "↗️" },
//     { name: "Isometric", preset: "isometric", icon: "🎯" },
//   ];

//   const popularShapeOptions = [
//     // These are for "customExtruded" type
//     { name: "Heart", type: "heart", icon: "❤️" },
//     { name: "Star", type: "star", icon: "⭐" },
//     { name: "Crown", type: "crown", icon: "👑" },
//     { name: "Lightning", type: "lightning", icon: "⚡" },
//     { name: "Diamond", type: "diamond", icon: "💎" },
//     { name: "Shield", type: "shield", icon: "🛡️" },
//     { name: "Arrow", type: "arrow", icon: "➡️" },
//     { name: "Leaf", type: "leaf", icon: "🍃" },
//     { name: "Sword", type: "sword", icon: "⚔️" },
//     { name: "Butterfly", type: "butterfly", icon: "🦋" },
//   ];

//   return (
//     <motion.div
//       initial={{ x: -20, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ delay: 0.1 }}
//       className='w-80 p-6 bg-card/60 backdrop-blur-lg border-r border-border/60 overflow-y-auto shadow-2xl'
//     >
//       <Tabs defaultValue='tools' className='space-y-6'>
//         <TabsList className='grid w-full grid-cols-4'>
//           <TabsTrigger value='tools'>Tools</TabsTrigger>
//           <TabsTrigger value='shapes'>Shapes</TabsTrigger>
//           <TabsTrigger value='popular'>Popular</TabsTrigger>
//           <TabsTrigger value='camera'>Camera</TabsTrigger>
//         </TabsList>

//         <TabsContent value='tools' className='space-y-6'>
//           <Card className='bg-background/50'>
//             <CardHeader>
//               <CardTitle className='flex items-center space-x-2'>
//                 <span>🛠️</span>
//                 <span>Transform Tools</span>
//               </CardTitle>
//               <CardDescription>
//                 Select how you want to manipulate objects
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className='grid grid-cols-3 gap-3'>
//                 {transformToolOptions.map((tool) => (
//                   <Tooltip key={tool.toolMode}>
//                     <TooltipTrigger asChild>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <Button
//                           onClick={() => setMode(tool.toolMode)}
//                           variant={
//                             mode === tool.toolMode ? "default" : "outline"
//                           }
//                           size='sm'
//                           className='flex flex-col items-center justify-center h-16 w-full'
//                         >
//                           <span className='text-lg mb-1'>{tool.icon}</span>
//                           <span className='text-xs capitalize'>
//                             {tool.label}
//                           </span>
//                         </Button>
//                       </motion.div>
//                     </TooltipTrigger>
//                     <TooltipContent>{tool.tooltip}</TooltipContent>
//                   </Tooltip>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value='shapes' className='space-y-6'>
//           <Card className='bg-background/50'>
//             <CardHeader>
//               <CardTitle className='flex items-center space-x-2'>
//                 <span>🧊</span>
//                 <span>Primitive Shapes</span>
//               </CardTitle>
//               <CardDescription>Click to add basic 3D objects</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className='grid grid-cols-2 gap-3'>
//                 {Array.isArray(shapeOptions) &&
//                   shapeOptions.map(
//                     (
//                       shape // shapeOptions comes from Model3DCreator
//                     ) => (
//                       <Tooltip key={shape.name}>
//                         <TooltipTrigger asChild>
//                           <motion.div
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.98 }}
//                           >
//                             <Button
//                               onClick={() => addShape(shape.geometry)} // addShape uses geometry type string
//                               variant='outline'
//                               size='sm'
//                               className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/10 transition-all'
//                             >
//                               <span className='text-xl mb-1'>{shape.icon}</span>
//                               <span className='text-xs'>{shape.name}</span>
//                             </Button>
//                           </motion.div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           Add {shape.name} to scene
//                         </TooltipContent>
//                       </Tooltip>
//                     )
//                   )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value='popular' className='space-y-6'>
//           <Card className='bg-background/50'>
//             <CardHeader>
//               <CardTitle className='flex items-center space-x-2'>
//                 <span>💖</span>
//                 <span>Popular Shapes</span>
//               </CardTitle>
//               <CardDescription>
//                 Add pre-designed 2D extruded shapes
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className='grid grid-cols-2 gap-3'>
//                 {popularShapeOptions.map((shape) => (
//                   <Tooltip key={shape.name}>
//                     <TooltipTrigger asChild>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <Button
//                           onClick={() =>
//                             addShape("customExtruded", {
//                               shapeType: shape.type,
//                             })
//                           }
//                           variant='outline'
//                           size='sm'
//                           className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/10 transition-all'
//                         >
//                           <span className='text-xl mb-1'>{shape.icon}</span>
//                           <span className='text-xs'>{shape.name}</span>
//                         </Button>
//                       </motion.div>
//                     </TooltipTrigger>
//                     <TooltipContent>Add {shape.name} to scene</TooltipContent>
//                   </Tooltip>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value='camera' className='space-y-6'>
//           <Card className='bg-background/50'>
//             <CardHeader>
//               <CardTitle className='flex items-center space-x-2'>
//                 <span>📷</span>
//                 <span>Camera Views</span>
//               </CardTitle>
//               <CardDescription>
//                 Quick camera positioning presets
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className='grid grid-cols-2 gap-3'>
//                 {cameraViewOptions.map((view) => (
//                   <Tooltip key={view.preset}>
//                     <TooltipTrigger asChild>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <Button
//                           onClick={() => setCameraView(view.preset)}
//                           variant='outline'
//                           size='sm'
//                           className='flex items-center justify-center space-x-2 w-full'
//                         >
//                           <span>{view.icon}</span>
//                           <span className='text-xs'>{view.name}</span>
//                         </Button>
//                       </motion.div>
//                     </TooltipTrigger>
//                     <TooltipContent>Switch to {view.name} view</TooltipContent>
//                   </Tooltip>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </motion.div>
//   );
// }

import React from "react"; // Added React import
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
import {
  Move,
  RotateCcw,
  Scale,
  Camera,
  Shapes,
  Heart,
  Star,
  Crown,
  Zap,
  Gem,
  Shield,
  ArrowRight,
  Leaf,
  Swords,
  Feather,
} from "lucide-react"; // Using Lucide icons

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
      icon: <Move className='h-5 w-5' />,
      label: "Translate",
      tooltip: "Move (W)",
    },
    {
      toolMode: "rotate",
      icon: <RotateCcw className='h-5 w-5' />,
      label: "Rotate",
      tooltip: "Rotate (E)",
    },
    {
      toolMode: "scale",
      icon: <Scale className='h-5 w-5' />,
      label: "Scale",
      tooltip: "Scale (R)",
    },
  ];

  const cameraViewOptions = [
    { name: "Top", preset: "top", icon: <Camera className='h-4 w-4' /> }, // Icon adjusted for consistency
    { name: "Front", preset: "front", icon: <Camera className='h-4 w-4' /> },
    { name: "Side", preset: "side", icon: <Camera className='h-4 w-4' /> },
    {
      name: "Isometric",
      preset: "isometric",
      icon: <Camera className='h-4 w-4' />,
    },
  ];

  const popularShapeOptions = [
    { name: "Heart", type: "heart", icon: <Heart className='h-6 w-6' /> },
    { name: "Star", type: "star", icon: <Star className='h-6 w-6' /> },
    { name: "Crown", type: "crown", icon: <Crown className='h-6 w-6' /> },
    { name: "Lightning", type: "lightning", icon: <Zap className='h-6 w-6' /> },
    { name: "Diamond", type: "diamond", icon: <Gem className='h-6 w-6' /> },
    { name: "Shield", type: "shield", icon: <Shield className='h-6 w-6' /> },
    { name: "Arrow", type: "arrow", icon: <ArrowRight className='h-6 w-6' /> },
    { name: "Leaf", type: "leaf", icon: <Leaf className='h-6 w-6' /> },
    { name: "Sword", type: "sword", icon: <Swords className='h-6 w-6' /> },
    {
      name: "Butterfly",
      type: "butterfly",
      icon: <Feather className='h-6 w-6' />,
    },
  ];

  // Map string icons from shapeOptions (Model3DCreator) to Lucide icons if needed or use emojis
  const getPrimitiveIcon = (iconString) => {
    switch (iconString) {
      case "🧊":
        return <Shapes className='h-6 w-6' />; // Generic for cube
      case "⚪":
        return <Shapes className='h-6 w-6' />; // Generic for sphere
      case "🥫":
        return <Shapes className='h-6 w-6' />; // Generic for cylinder
      case "🔺":
        return <Shapes className='h-6 w-6' />; // Generic for cone/pyramid
      case "🍩":
        return <Shapes className='h-6 w-6' />; // Generic for torus
      case "📝":
        return <Shapes className='h-6 w-6' />; // Generic for text
      case "⛰️":
        return <Shapes className='h-6 w-6' />;
      default:
        return <Shapes className='h-6 w-6' />;
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className='w-72 p-4 bg-card/60 backdrop-blur-lg border-r border-border/60 overflow-y-auto shadow-2xl' // Slightly smaller width
    >
      <Tabs defaultValue='tools' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='tools'>Tools</TabsTrigger>
          <TabsTrigger value='shapes'>Shapes</TabsTrigger>
          <TabsTrigger value='popular'>Popular</TabsTrigger>
          <TabsTrigger value='camera'>Camera</TabsTrigger>
        </TabsList>

        <TabsContent value='tools' className='space-y-4'>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base flex items-center space-x-2'>
                <span>🛠️</span>
                <span>Transform</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-3 gap-2'>
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
                          <span className='mb-1'>{tool.icon}</span>
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

        <TabsContent value='shapes' className='space-y-4'>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base flex items-center space-x-2'>
                <span>🧊</span>
                <span>Primitives</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
                {Array.isArray(shapeOptions) &&
                  shapeOptions.map((shape) => (
                    <Tooltip key={shape.name}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => addShape(shape.geometry)}
                            variant='outline'
                            size='sm'
                            className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/10 transition-all'
                          >
                            <span className='mb-1'>
                              {getPrimitiveIcon(shape.icon)}
                            </span>
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

        <TabsContent value='popular' className='space-y-4'>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base flex items-center space-x-2'>
                <span>💖</span>
                <span>Popular</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
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
                          <span className='mb-1'>{shape.icon}</span>
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

        <TabsContent value='camera' className='space-y-4'>
          <Card className='bg-background/50'>
            <CardHeader className='pb-2 pt-4 px-4'>
              <CardTitle className='text-base flex items-center space-x-2'>
                <span>📷</span>
                <span>Views</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-2'>
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
                          className='flex items-center justify-center space-x-2 w-full py-3'
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
