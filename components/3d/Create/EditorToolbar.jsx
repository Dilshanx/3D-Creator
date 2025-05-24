// // // EditorToolbar.jsx
// // import { motion } from "framer-motion";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip"; // TooltipProvider will be in the parent
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";

// // export default function EditorToolbar({
// //   undo,
// //   redo,
// //   undoStackLength,
// //   redoStackLength,
// //   exportJSON,
// //   exportGLBFile,
// // }) {
// //   return (
// //     <motion.div
// //       initial={{ y: -20, opacity: 0 }}
// //       animate={{ y: 0, opacity: 1 }}
// //       className='flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm border-b border-border/50'
// //     >
// //       <div className='flex items-center space-x-4'>
// //         <div className='flex items-center space-x-3'>
// //           <motion.div
// //             whileHover={{ scale: 1.05 }}
// //             className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'
// //           >
// //             <span className='text-white font-bold text-lg'>3D</span>
// //           </motion.div>
// //           <div>
// //             <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
// //               Model Creator
// //             </h1>
// //             <p className='text-xs text-muted-foreground'>
// //               Professional 3D Design Tool
// //             </p>
// //           </div>
// //         </div>
// //         <Badge
// //           variant='secondary'
// //           className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-200'
// //         >
// //           v2.0 • GLB Export
// //         </Badge>
// //       </div>
// //       <div className='flex items-center space-x-2'>
// //         <Tooltip>
// //           <TooltipTrigger asChild>
// //             <Button
// //               onClick={undo}
// //               disabled={undoStackLength === 0}
// //               variant='outline'
// //               size='sm'
// //               className='transition-all duration-200'
// //             >
// //               ↶ Undo
// //             </Button>
// //           </TooltipTrigger>
// //           <TooltipContent>Undo last action</TooltipContent>
// //         </Tooltip>
// //         <Tooltip>
// //           <TooltipTrigger asChild>
// //             <Button
// //               onClick={redo}
// //               disabled={redoStackLength === 0}
// //               variant='outline'
// //               size='sm'
// //               className='transition-all duration-200'
// //             >
// //               ↷ Redo
// //             </Button>
// //           </TooltipTrigger>
// //           <TooltipContent>Redo last action</TooltipContent>
// //         </Tooltip>
// //         <Separator orientation='vertical' className='h-6' />
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <Button variant='outline' size='sm'>
// //               📤 Export
// //             </Button>
// //           </DropdownMenuTrigger>
// //           <DropdownMenuContent>
// //             <DropdownMenuItem onClick={exportJSON}>
// //               📄 Export as JSON
// //             </DropdownMenuItem>
// //             <DropdownMenuItem onClick={exportGLBFile}>
// //               📦 Export as GLB
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>
// //       </div>
// //     </motion.div>
// //   );
// // }

// // EditorToolbar.jsx
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
// } from "@/components/ui/dropdown-menu";

// export default function EditorToolbar({
//   undo,
//   redo,
//   undoStackLength,
//   redoStackLength,
//   exportJSON,
//   exportGLBFile,
// }) {
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
//             PBR Model Creator
//           </h1>
//           <p className='text-xs text-muted-foreground'>
//             Advanced 3D Design with PBR & HDR
//           </p>
//         </div>
//         <Badge
//           variant='secondary'
//           className='bg-gradient-to-r from-green-500/10 to-teal-500/10 text-green-600 border-green-300'
//         >
//           v2.1 • PBR
//         </Badge>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={undo}
//               disabled={undoStackLength === 0}
//               variant='outline'
//               size='sm'
//               className='transition-all duration-200'
//             >
//               ↶ Undo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Undo last action (Ctrl+Z)</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={redo}
//               disabled={redoStackLength === 0}
//               variant='outline'
//               size='sm'
//               className='transition-all duration-200'
//             >
//               ↷ Redo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Redo last action (Ctrl+Y)</TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' size='sm' className='hover:bg-primary/10'>
//               <span className='mr-2'>📤</span> Export
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuItem onClick={exportJSON}>
//               <span className='mr-2'>📄</span> Export as JSON
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={exportGLBFile}>
//               <span className='mr-2'>📦</span> Export as GLB (PBR)
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </motion.div>
//   );
// }

// EditorToolbar.jsx
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
// } from "@/components/ui/dropdown-menu";

// export default function EditorToolbar({
//   undo,
//   redo,
//   undoStackLength,
//   redoStackLength,
//   exportJSON,
//   exportGLBFile,
// }) {
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
//             PBR Model Creator
//           </h1>
//           <p className='text-xs text-muted-foreground'>
//             Advanced 3D Design with PBR & HDR
//           </p>
//         </div>
//         <Badge
//           variant='secondary'
//           className='bg-gradient-to-r from-green-500/10 to-teal-500/10 text-green-600 border-green-300'
//         >
//           v2.1 • PBR
//         </Badge>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={undo}
//               disabled={undoStackLength === 0}
//               variant='outline'
//               size='sm'
//               className='transition-all duration-200'
//             >
//               ↶ Undo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Undo last action (Ctrl+Z)</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={redo}
//               disabled={redoStackLength === 0}
//               variant='outline'
//               size='sm'
//               className='transition-all duration-200'
//             >
//               ↷ Redo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Redo last action (Ctrl+Y)</TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' size='sm' className='hover:bg-primary/10'>
//               <span className='mr-2'>📤</span> Export
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuItem onClick={exportJSON}>
//               <span className='mr-2'>📄</span> Export as JSON
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={exportGLBFile}>
//               <span className='mr-2'>📦</span> Export as GLB (PBR)
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </motion.div>
//   );
// }

// EditorToolbar.jsx
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
// } from "@/components/ui/dropdown-menu";
// import { PlayIcon, PauseIcon } from "@radix-ui/react-icons"; // Or your preferred icons

// export default function EditorToolbar({
//   undo,
//   redo,
//   undoStackLength,
//   redoStackLength,
//   exportJSON,
//   exportGLBFile,
//   isAnimating,
//   toggleGlobalAnimation,
// }) {
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
//             Animated PBR Creator
//           </h1>
//           <p className='text-xs text-muted-foreground'>
//             Design, Animate, Export
//           </p>
//         </div>
//         <Badge
//           variant='secondary'
//           className='bg-gradient-to-r from-pink-500/10 to-orange-500/10 text-pink-600 border-pink-300'
//         >
//           v2.2 • Animation
//         </Badge>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={toggleGlobalAnimation}
//               variant='outline'
//               size='sm'
//               className='transition-all duration-200 w-28' // Ensure enough width
//             >
//               {isAnimating ? (
//                 <PauseIcon className='mr-2 h-4 w-4' />
//               ) : (
//                 <PlayIcon className='mr-2 h-4 w-4' />
//               )}
//               {isAnimating ? "Pause All (P)" : "Play All (P)"}
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             {isAnimating
//               ? "Pause all scene animations"
//               : "Play all scene animations"}
//           </TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={undo}
//               disabled={undoStackLength === 0}
//               variant='outline'
//               size='sm'
//             >
//               ↶ Undo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={redo}
//               disabled={redoStackLength === 0}
//               variant='outline'
//               size='sm'
//             >
//               ↷ Redo
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
//         </Tooltip>
//         <Separator orientation='vertical' className='h-6' />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' size='sm' className='hover:bg-primary/10'>
//               <span className='mr-2'>📤</span> Export
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuItem onClick={exportJSON}>
//               <span className='mr-2'>📄</span> Export as JSON
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={exportGLBFile}>
//               <span className='mr-2'>📦</span> Export as GLB
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </motion.div>
//   );
// }

// EditorToolbar.jsx
// EditorToolbar.jsx
// EditorToolbar.jsx
// EditorToolbar.jsx
// EditorToolbar.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// --- VERIFY ALL THESE ICON NAMES ON https://lucide.dev/ ---
import {
  Play, // Seems correct
  Pause, // Seems correct
  Archive, // Seems correct for "File" menu trigger
  Cube, // Seems correct for "Static GLB"
  Film, // Seems correct for "Animated GLB" (or Video)
  FileText, // Seems correct for "Export JSON"
  FilePlus, // Seems correct for "Import JSON"
  Undo2, // Seems correct
  Redo2, // Seems correct
  AlignHorizontalJustifyStart, // VERIFY - for horizontal align
  AlignVerticalJustifyStart, // VERIFY - for vertical align
  Layers, // VERIFY - possible for "Depth Align" or rotate another
  Target, // Seems correct for "Align to Origin"
  LayoutPanelLeft, // VERIFY - possible for "Align" menu trigger
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
  alignAllShapes,
  alignSelectedShapeToOrigin,
  selectedShapeId,
  shapesCount,
  isAnimating,
  toggleGlobalAnimation,
  isBaking,
}) {
  const iconSize = 16;
  const iconStrokeWidth = 1.5;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='flex justify-between items-center p-4 bg-card/80 backdrop-blur-lg border-b border-border/60 shadow-md'
    >
      <div className='flex items-center space-x-4'>
        {/* ... Logo and App Title ... */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'
        >
          <span className='text-white font-bold text-lg'>3D</span>
        </motion.div>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
            Creator Pro
          </h1>
          <p className='text-xs text-muted-foreground'>
            Design, Animate, Align & Export
          </p>
        </div>
        <Badge
          variant='secondary'
          className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-300'
        >
          v2.4 • Align Tools
        </Badge>
      </div>

      <div className='flex items-center space-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleGlobalAnimation}
              variant='outline'
              size='sm'
              className='w-32'
              disabled={isBaking}
            >
              {isAnimating ? (
                <Pause
                  size={iconSize}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2'
                />
              ) : (
                <Play
                  size={iconSize}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2'
                />
              )}
              {isAnimating ? "Pause All (P)" : "Play All (P)"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isAnimating ? "Pause animations" : "Play animations"}
          </TooltipContent>
        </Tooltip>
        <Separator orientation='vertical' className='h-6' />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={undo}
              disabled={undoStackLength === 0 || isBaking}
              variant='outline'
              size='icon'
              className='w-9 h-9'
            >
              <Undo2 size={iconSize} strokeWidth={iconStrokeWidth} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={redo}
              disabled={redoStackLength === 0 || isBaking}
              variant='outline'
              size='icon'
              className='w-9 h-9'
            >
              <Redo2 size={iconSize} strokeWidth={iconStrokeWidth} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
        <Separator orientation='vertical' className='h-6' />

        {/* Align Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' disabled={isBaking}>
              {/* Ensure LayoutPanelLeft is a valid icon you want */}
              <LayoutPanelLeft
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Align
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Align All Shapes</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => alignAllShapes("x", "average")}
              disabled={isBaking || shapesCount < 2}
            >
              {/* Ensure AlignHorizontalJustifyStart is valid */}
              <AlignHorizontalJustifyStart
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Horizontally (Avg X)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alignAllShapes("y", "average")}
              disabled={isBaking || shapesCount < 2}
            >
              {/* Ensure AlignVerticalJustifyStart is valid */}
              <AlignVerticalJustifyStart
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Vertically (Avg Y)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alignAllShapes("z", "average")}
              disabled={isBaking || shapesCount < 2}
            >
              {/* Ensure Layers is valid and appropriate, or rotate another icon */}
              <Layers
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              By Depth (Avg Z)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Align Selected to Origin</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => alignSelectedShapeToOrigin("x")}
              disabled={isBaking || !selectedShapeId}
            >
              <Target
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              X to Origin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alignSelectedShapeToOrigin("y")}
              disabled={isBaking || !selectedShapeId}
            >
              <Target
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Y to Origin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alignSelectedShapeToOrigin("z")}
              disabled={isBaking || !selectedShapeId}
            >
              <Target
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Z to Origin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* File Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-primary/10'
              disabled={isBaking}
            >
              <Archive
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={triggerJsonFileImport}
              disabled={isBaking}
            >
              <FilePlus
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportJSON} disabled={isBaking}>
              <FileText
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportStaticGLBFile} disabled={isBaking}>
              <Layers
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Export Static GLB
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={bakeAndExportAnimatedGLB}
              disabled={isBaking}
            >
              <Film
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='mr-2'
              />{" "}
              Export Animated GLB
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
