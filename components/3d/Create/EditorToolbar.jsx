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
} from "@/components/ui/dropdown-menu";

export default function EditorToolbar({
  undo,
  redo,
  undoStackLength,
  redoStackLength,
  exportJSON,
  exportGLBFile,
}) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='flex justify-between items-center p-4 bg-card/80 backdrop-blur-lg border-b border-border/60 shadow-md'
    >
      <div className='flex items-center space-x-4'>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'
        >
          <span className='text-white font-bold text-lg'>3D</span>
        </motion.div>
        <div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
            PBR Model Creator
          </h1>
          <p className='text-xs text-muted-foreground'>
            Advanced 3D Design with PBR & HDR
          </p>
        </div>
        <Badge
          variant='secondary'
          className='bg-gradient-to-r from-green-500/10 to-teal-500/10 text-green-600 border-green-300'
        >
          v2.1 • PBR
        </Badge>
      </div>
      <div className='flex items-center space-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={undo}
              disabled={undoStackLength === 0}
              variant='outline'
              size='sm'
              className='transition-all duration-200'
            >
              ↶ Undo
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo last action (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={redo}
              disabled={redoStackLength === 0}
              variant='outline'
              size='sm'
              className='transition-all duration-200'
            >
              ↷ Redo
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo last action (Ctrl+Y)</TooltipContent>
        </Tooltip>
        <Separator orientation='vertical' className='h-6' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='hover:bg-primary/10'>
              <span className='mr-2'>📤</span> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={exportJSON}>
              <span className='mr-2'>📄</span> Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportGLBFile}>
              <span className='mr-2'>📦</span> Export as GLB (PBR)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
