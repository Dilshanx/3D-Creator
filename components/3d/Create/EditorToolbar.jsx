// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";

// import {
//   Play,
//   Pause,
//   Archive,
//   Image as ImageIcon, // New icon for Image import
//   Film,
//   FileText,
//   FilePlus,
//   Undo2,
//   Redo2,
//   AlignHorizontalJustifyStart,
//   AlignVerticalJustifyStart,
//   Layers,
//   Target,
//   LayoutPanelLeft,
//   UploadCloud,
// } from "lucide-react";

// export default function EditorToolbar({
//   undo,
//   redo,
//   undoStackLength,
//   redoStackLength,
//   exportJSON,
//   exportStaticGLBFile,
//   bakeAndExportAnimatedGLB,
//   triggerJsonFileImport,
//   triggerGlbFileImport,
//   triggerImageFileImport, // New prop
//   alignAllShapes,
//   alignSelectedShapeToOrigin,
//   selectedShapeId,
//   shapesCount,
//   isAnimating,
//   toggleGlobalAnimation,
//   isBaking,
// }) {
//   const iconSize = 16;
//   const iconStrokeWidth = 1.5;

//   return (
//     <motion.div
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className='flex justify-between items-center p-4 bg-card/80 backdrop-blur-lg border-b border-border/60 shadow-md'
//     >
//       <div className='flex items-center space-x-4'>
//         <motion.div
//           whileHover={{ scale: 1.05, rotate: 5 }}
//           className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'
//         >
//           <span className='text-white font-bold text-lg'>3D</span>
//         </motion.div>
//         <div>
//           <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
//             Creator Pro
//           </h1>
//           <p className='text-xs text-muted-foreground'>
//             Design, Animate, Align & Export
//           </p>
//         </div>
//         <Badge
//           variant='secondary'
//           className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-300'
//         >
//           v2.6 • Image Planes {/* Updated Version Badge */}
//         </Badge>
//       </div>

//       <div className='flex items-center space-x-2'>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={toggleGlobalAnimation}
//               variant='outline'
//               size='sm'
//               className='w-32'
//               disabled={isBaking}
//             >
//               {isAnimating ? (
//                 <Pause
//                   size={iconSize}
//                   strokeWidth={iconStrokeWidth}
//                   className='mr-2'
//                 />
//               ) : (
//                 <Play
//                   size={iconSize}
//                   strokeWidth={iconStrokeWidth}
//                   className='mr-2'
//                 />
//               )}
//               {isAnimating ? "Pause All (P)" : "Play All (P)"}
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             {isAnimating ? "Pause animations" : "Play animations"}
//           </TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={undo}
//               disabled={undoStackLength === 0 || isBaking}
//               variant='outline'
//               size='icon'
//               className='w-9 h-9'
//             >
//               <Undo2 size={iconSize} strokeWidth={iconStrokeWidth} />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={redo}
//               disabled={redoStackLength === 0 || isBaking}
//               variant='outline'
//               size='icon'
//               className='w-9 h-9'
//             >
//               <Redo2 size={iconSize} strokeWidth={iconStrokeWidth} />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />

//         {/* Align Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='outline' size='sm' disabled={isBaking}>
//               <LayoutPanelLeft
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Align
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Align All Shapes</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => alignAllShapes("x", "average")}
//               disabled={isBaking || shapesCount < 2}
//             >
//               <AlignHorizontalJustifyStart
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Horizontally (Avg X)
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => alignAllShapes("y", "average")}
//               disabled={isBaking || shapesCount < 2}
//             >
//               <AlignVerticalJustifyStart
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Vertically (Avg Y)
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => alignAllShapes("z", "average")}
//               disabled={isBaking || shapesCount < 2}
//             >
//               <Layers
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               By Depth (Avg Z)
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuLabel>Align Selected to Origin</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => alignSelectedShapeToOrigin("x")}
//               disabled={isBaking || !selectedShapeId}
//             >
//               <Target
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               X to Origin
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => alignSelectedShapeToOrigin("y")}
//               disabled={isBaking || !selectedShapeId}
//             >
//               <Target
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Y to Origin
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => alignSelectedShapeToOrigin("z")}
//               disabled={isBaking || !selectedShapeId}
//             >
//               <Target
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Z to Origin
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* File Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant='ghost'
//               size='sm'
//               className='hover:bg-primary/10'
//               disabled={isBaking}
//             >
//               <Archive
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               File
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuItem
//               onClick={triggerJsonFileImport}
//               disabled={isBaking}
//             >
//               <FilePlus
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Import JSON
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={triggerGlbFileImport}
//               disabled={isBaking}
//             >
//               <UploadCloud
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Import GLB/GLTF
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={triggerImageFileImport}
//               disabled={isBaking}
//             >
//               {" "}
//               {/* New Item */}
//               <ImageIcon
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Import Image
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={exportJSON} disabled={isBaking}>
//               <FileText
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Export JSON
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={exportStaticGLBFile} disabled={isBaking}>
//               <Layers
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Export Static GLB
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={bakeAndExportAnimatedGLB}
//               disabled={isBaking}
//             >
//               <Film
//                 size={iconSize}
//                 strokeWidth={iconStrokeWidth}
//                 className='mr-2'
//               />{" "}
//               Export Animated GLB
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </motion.div>
//   );
// }

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Undo,
  Redo,
  FileJsonIcon,
  FilePlus2,
  Download,
  UploadCloud,
  ImagePlus,
  AlignCenterHorizontal,
  LocateFixed,
  Play,
  Pause,
  Maximize,
  Minimize2,
  PackageOpen,
  PackagePlus,
} from "lucide-react";

export default function EditorToolbar({
  undo,
  redo,
  undoStackLength,
  redoStackLength,
  exportJSON,
  exportStaticGLBFile,
  bakeAndExportAnimatedGLB,
  triggerJsonFileImport,
  triggerGlbFileImport,
  triggerImageFileImport,
  alignAllShapes,
  alignSelectedShapeToOrigin,
  selectedShapeId,
  shapesCount,
  isAnimating,
  toggleGlobalAnimation,
  isBaking,
  handleToggleFullscreen,
  isFullscreen,
}) {
  return (
    <div className='p-2 bg-card/80 backdrop-blur-md border-b border-border/60 shadow-lg flex items-center justify-between space-x-1 text-sm flex-wrap gap-y-1'>
      {/* File Operations */}
      <div className='flex items-center space-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={triggerJsonFileImport}
              disabled={isBaking}
            >
              <UploadCloud className='h-4 w-4 mr-1' />
              Load Scene
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load scene from JSON (.json)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={exportJSON}
              disabled={isBaking || shapesCount === 0}
            >
              <FileJsonIcon className='h-4 w-4 mr-1' />
              Save Scene
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save scene to JSON (.json)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={triggerGlbFileImport}
              disabled={isBaking}
            >
              <PackagePlus className='h-4 w-4 mr-1' />
              Import GLB
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import 3D Model (.glb, .gltf)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={triggerImageFileImport}
              disabled={isBaking}
            >
              <ImagePlus className='h-4 w-4 mr-1' />
              Import Image
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import Image as Plane</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Edit Operations */}
      <div className='flex items-center space-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={undo}
              disabled={undoStackLength === 0 || isBaking}
            >
              <Undo className='h-4 w-4 mr-1' />
              Undo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={redo}
              disabled={redoStackLength === 0 || isBaking}
            >
              <Redo className='h-4 w-4 mr-1' />
              Redo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Tools & View */}
      <div className='flex items-center space-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={alignAllShapes}
              disabled={isBaking || shapesCount < 2}
            >
              <AlignCenterHorizontal className='h-4 w-4 mr-1' />
              Align All
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align all shapes along X-axis</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={alignSelectedShapeToOrigin}
              disabled={isBaking || !selectedShapeId}
            >
              <LocateFixed className='h-4 w-4 mr-1' />
              Center Selected
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Center selected shape (XZ) at origin</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleToggleFullscreen}
              disabled={isBaking}
            >
              {isFullscreen ? (
                <Minimize2 className='h-4 w-4 mr-1' />
              ) : (
                <Maximize className='h-4 w-4 mr-1' />
              )}
              {isFullscreen ? "Windowed" : "Fullscreen"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isFullscreen ? "Exit Fullscreen Mode" : "Enter Fullscreen Mode"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Export Operations */}
      <div className='flex items-center space-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={exportStaticGLBFile}
              disabled={isBaking || shapesCount === 0}
            >
              <PackageOpen className='h-4 w-4 mr-1' />
              Export Static GLB
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export scene as Static GLB</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={bakeAndExportAnimatedGLB}
              disabled={isBaking || shapesCount === 0}
            >
              <PackageOpen className='h-4 w-4 mr-1' />
              Export Animated GLB
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export scene with baked animations as GLB</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Animation Toggle */}
      <div className='flex items-center space-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleGlobalAnimation}
              disabled={isBaking}
            >
              {isAnimating ? (
                <Pause className='h-4 w-4 mr-1' />
              ) : (
                <Play className='h-4 w-4 mr-1' />
              )}
              {isAnimating ? "Pause Anim" : "Play Anim"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle procedural animations (P)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
