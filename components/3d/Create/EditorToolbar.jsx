// "use client";

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator as UiSeparator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import React, { useState, useEffect, useRef } from "react";

// import {
//   Play,
//   Pause,
//   Archive,
//   Image as ImageIconLucide,
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
//   Maximize,
//   Minimize,
//   PanelLeft,
//   PanelRight,
//   RefreshCw,
// } from "lucide-react";

// // Custom Dropdown Item Component with light/dark mode support
// const CustomDropdownItem = ({
//   onClick,
//   disabled,
//   children,
//   icon: IconComponent,
//   iconSize,
//   iconStrokeWidth,
// }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={cn(
//       "w-full text-left px-3 py-2 text-sm flex items-center rounded-sm transition-colors duration-150",
//       "text-gray-700 dark:text-slate-200",
//       "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-purple-600/30 dark:hover:text-purple-200",
//       "focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-purple-600/30 dark:focus:text-purple-200 focus:outline-none",
//       "cursor-pointer",
//       disabled &&
//         "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
//     )}
//   >
//     {IconComponent && (
//       <IconComponent
//         size={iconSize - 2}
//         strokeWidth={iconStrokeWidth}
//         className='mr-2 text-gray-500 dark:text-slate-400'
//       />
//     )}
//     {children}
//   </button>
// );

// // Custom Dropdown Label with light/dark mode support
// const CustomDropdownLabel = ({ children }) => (
//   <div className='px-3 py-1.5 text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide'>
//     {children}
//   </div>
// );

// // Custom Dropdown Separator with light/dark mode support
// const CustomDropdownSeparator = () => (
//   <div className='my-1 h-px bg-gray-200 dark:bg-slate-700'></div>
// );

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
//   triggerImageFileImport,
//   alignAllShapes,
//   alignSelectedShapeToOrigin,
//   selectedShapeId,
//   shapesCount,
//   isAnimating,
//   toggleGlobalAnimation,
//   isBaking,
//   isFullscreen,
//   toggleFullscreen,
//   toggleLeftSidebar,
//   toggleRightSidebar,
//   isLeftSidebarOpen,
//   isRightSidebarOpen,
//   forceRefreshCanvas,
// }) {
//   const iconSize = 16;
//   const iconStrokeWidth = 1.5;

//   const [isAlignDropdownOpen, setIsAlignDropdownOpen] = useState(false);
//   const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);

//   const alignDropdownRef = useRef(null);
//   const fileDropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         alignDropdownRef.current &&
//         !alignDropdownRef.current.contains(event.target)
//       ) {
//         setIsAlignDropdownOpen(false);
//       }
//       if (
//         fileDropdownRef.current &&
//         !fileDropdownRef.current.contains(event.target)
//       ) {
//         setIsFileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Close dropdowns when ESC is pressed
//   useEffect(() => {
//     const handleEscapeKey = (event) => {
//       if (event.key === "Escape") {
//         setIsAlignDropdownOpen(false);
//         setIsFileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("keydown", handleEscapeKey);
//     return () => {
//       document.removeEventListener("keydown", handleEscapeKey);
//     };
//   }, []);

//   // Updated base class with light/dark mode support
//   const buttonBaseClass =
//     "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100 dark:hover:border-slate-500 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";

//   const iconButtonClass = cn(
//     buttonBaseClass,
//     "w-9 h-9 p-0 flex items-center justify-center shrink-0"
//   );

//   const alignDropdownItems = [
//     { type: "label", label: "Align All Shapes" },
//     {
//       label: "Horizontally (Avg X)",
//       action: () => alignAllShapes("x", "average"),
//       icon: AlignHorizontalJustifyStart,
//       disabled: isBaking || shapesCount < 2,
//     },
//     {
//       label: "Vertically (Avg Y)",
//       action: () => alignAllShapes("y", "average"),
//       icon: AlignVerticalJustifyStart,
//       disabled: isBaking || shapesCount < 2,
//     },
//     {
//       label: "By Depth (Avg Z)",
//       action: () => alignAllShapes("z", "average"),
//       icon: Layers,
//       disabled: isBaking || shapesCount < 2,
//     },
//     { type: "separator" },
//     { type: "label", label: "Align Selected to Origin" },
//     {
//       label: "X to Origin",
//       action: () => alignSelectedShapeToOrigin("x"),
//       icon: Target,
//       disabled: isBaking || !selectedShapeId,
//     },
//     {
//       label: "Y to Origin",
//       action: () => alignSelectedShapeToOrigin("y"),
//       icon: Target,
//       disabled: isBaking || !selectedShapeId,
//     },
//     {
//       label: "Z to Origin",
//       action: () => alignSelectedShapeToOrigin("z"),
//       icon: Target,
//       disabled: isBaking || !selectedShapeId,
//     },
//   ];

//   const fileDropdownItems = [
//     { type: "label", label: "Import" },
//     {
//       label: "Import JSON Scene",
//       action: triggerJsonFileImport,
//       icon: FilePlus,
//       disabled: isBaking,
//     },
//     {
//       label: "Import GLB/GLTF",
//       action: triggerGlbFileImport,
//       icon: UploadCloud,
//       disabled: isBaking,
//     },
//     {
//       label: "Import Image Plane",
//       action: triggerImageFileImport,
//       icon: ImageIconLucide,
//       disabled: isBaking,
//     },
//     { type: "separator" },
//     { type: "label", label: "Export" },
//     {
//       label: "Export Scene to JSON",
//       action: exportJSON,
//       icon: FileText,
//       disabled: isBaking,
//     },
//     {
//       label: "Export Static GLB",
//       action: exportStaticGLBFile,
//       icon: Layers,
//       disabled: isBaking,
//     },
//     {
//       label: "Export Animated GLB",
//       action: bakeAndExportAnimatedGLB,
//       icon: Film,
//       disabled: isBaking,
//     },
//   ];

//   return (
//     <motion.div
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       // CORRECTED: Replaced inline style zIndex with a high Tailwind z-index class `z-40`.
//       // This ensures the toolbar is above other content like side panels.
//       className='flex items-center px-3 sm:px-4 py-2.5 sm:py-3 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/50 shadow-lg sticky top-0 z-70'
//     >
//       {/* Left Section */}
//       <div className='flex items-center space-x-2 sm:space-x-3 shrink-0'>
//         <Button
//           variant={isLeftSidebarOpen ? "default" : "ghost"}
//           size='icon'
//           onClick={toggleLeftSidebar}
//           className='md:hidden w-9 h-9 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/70 data-[state=open]:bg-blue-600 dark:data-[state=open]:bg-purple-600 active:bg-blue-700 dark:active:bg-purple-700 data-[state=open]:text-white'
//           aria-label='Toggle Tools Panel'
//         >
//           <PanelLeft size={iconSize + 2} />
//         </Button>

//         <motion.div
//           whileHover={{ scale: 1.05, rotate: 5 }}
//           className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-pink-500 dark:to-orange-400 rounded-lg flex items-center justify-center shadow-lg shrink-0'
//         >
//           <span className='text-white font-bold text-lg sm:text-xl tracking-tighter'>
//             3D
//           </span>
//         </motion.div>

//         <div className='hidden sm:block'>
//           <h1 className='text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent'>
//             Creator Pro
//           </h1>
//           <p className='text-xs text-gray-500 dark:text-slate-400 hidden md:block'>
//             Design & Export Tool
//           </p>
//         </div>

//         <Badge
//           variant='outline'
//           className='bg-gray-100 border-blue-300 text-blue-700 dark:bg-slate-700/50 dark:border-purple-500/50 dark:text-purple-300 text-xs px-1.5 sm:px-2 py-0.5 hidden xs:inline-flex'
//         >
//           v2.8
//         </Badge>
//       </div>

//       {/* Center Section */}
//       <div className='flex-1 flex justify-center items-center space-x-1 sm:space-x-1.5 px-2 sm:px-4'>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={toggleGlobalAnimation}
//               variant='outline'
//               size='sm'
//               className={cn(buttonBaseClass, "w-auto px-2 sm:px-3 h-9")}
//               disabled={isBaking}
//             >
//               {isAnimating ? (
//                 <Pause
//                   size={iconSize}
//                   strokeWidth={iconStrokeWidth}
//                   className='sm:mr-1.5'
//                 />
//               ) : (
//                 <Play
//                   size={iconSize}
//                   strokeWidth={iconStrokeWidth}
//                   className='sm:mr-1.5'
//                 />
//               )}
//               <span className='hidden sm:inline'>
//                 {isAnimating ? "Pause" : "Play"}
//               </span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent
//             side='bottom'
//             className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//           >
//             <p>
//               {isAnimating
//                 ? "Pause all animations (P)"
//                 : "Play all animations (P)"}
//             </p>
//           </TooltipContent>
//         </Tooltip>

//         <UiSeparator
//           orientation='vertical'
//           className='h-5 bg-gray-300 dark:bg-slate-700'
//         />

//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={undo}
//               disabled={undoStackLength === 0 || isBaking}
//               variant='outline'
//               size='icon'
//               className={iconButtonClass}
//             >
//               <Undo2 size={iconSize} strokeWidth={iconStrokeWidth} />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent
//             side='bottom'
//             className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//           >
//             Undo (Ctrl+Z)
//           </TooltipContent>
//         </Tooltip>

//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={redo}
//               disabled={redoStackLength === 0 || isBaking}
//               variant='outline'
//               size='icon'
//               className={iconButtonClass}
//             >
//               <Redo2 size={iconSize} strokeWidth={iconStrokeWidth} />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent
//             side='bottom'
//             className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//           >
//             Redo (Ctrl+Y)
//           </TooltipContent>
//         </Tooltip>

//         <UiSeparator
//           orientation='vertical'
//           className='h-5 bg-gray-300 dark:bg-slate-700'
//         />

//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={forceRefreshCanvas}
//               variant='outline'
//               size='icon'
//               className={iconButtonClass}
//               disabled={isBaking}
//             >
//               <RefreshCw size={iconSize - 1} strokeWidth={iconStrokeWidth} />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent
//             side='bottom'
//             className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//           >
//             <p>Refresh Canvas View</p>
//           </TooltipContent>
//         </Tooltip>

//         {/* Align Dropdown */}
//         <div className='relative' ref={alignDropdownRef}>
//           <Button
//             variant='outline'
//             size='sm'
//             className={cn(
//               buttonBaseClass,
//               "px-2 sm:px-3 h-9 flex items-center",
//               isAlignDropdownOpen && "bg-gray-100 dark:bg-slate-700/70"
//             )}
//             disabled={isBaking}
//             onClick={() => setIsAlignDropdownOpen((prev) => !prev)}
//             aria-haspopup='true'
//             aria-expanded={isAlignDropdownOpen}
//           >
//             <LayoutPanelLeft
//               size={iconSize}
//               strokeWidth={iconStrokeWidth}
//               className='xs:mr-1.5'
//             />
//             <span className='hidden xs:inline'>Align</span>
//           </Button>
//           {isAlignDropdownOpen && (
//             <div
//               // CORRECTED: Added z-50 to ensure dropdown is above the z-40 toolbar.
//               className='absolute left-0 mt-1.5 w-56 origin-top-left rounded-md shadow-xl bg-white/80 border border-gray-200 dark:bg-slate-800/80 dark:border-slate-700 py-1 focus:outline-none backdrop-blur-sm z-50'
//               role='menu'
//               aria-orientation='vertical'
//             >
//               {alignDropdownItems.map((item, index) => {
//                 if (item.type === "label")
//                   return (
//                     <CustomDropdownLabel key={`label-${index}`}>
//                       {item.label}
//                     </CustomDropdownLabel>
//                   );
//                 if (item.type === "separator")
//                   return <CustomDropdownSeparator key={`sep-${index}`} />;
//                 return (
//                   <CustomDropdownItem
//                     key={item.label}
//                     onClick={() => {
//                       item.action();
//                       setIsAlignDropdownOpen(false);
//                     }}
//                     disabled={item.disabled}
//                     icon={item.icon}
//                     iconSize={iconSize}
//                     iconStrokeWidth={iconStrokeWidth}
//                   >
//                     {item.label}
//                   </CustomDropdownItem>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className='flex items-center space-x-1 sm:space-x-1.5 shrink-0'>
//         {/* File Dropdown */}
//         <div className='relative' ref={fileDropdownRef}>
//           <Button
//             variant='outline'
//             size='sm'
//             className={cn(
//               buttonBaseClass,
//               "px-2 sm:px-3 h-9 flex items-center",
//               isFileDropdownOpen && "bg-gray-100 dark:bg-slate-700/70"
//             )}
//             disabled={isBaking}
//             onClick={() => setIsFileDropdownOpen((prev) => !prev)}
//             aria-haspopup='true'
//             aria-expanded={isFileDropdownOpen}
//           >
//             <Archive
//               size={iconSize}
//               strokeWidth={iconStrokeWidth}
//               className='xs:mr-1.5'
//             />
//             <span className='hidden xs:inline'>File</span>
//           </Button>
//           {isFileDropdownOpen && (
//             <div
//               // CORRECTED: Added z-50 to ensure dropdown is above the z-40 toolbar.
//               className='absolute right-0 mt-1.5 w-56 origin-top-right rounded-md shadow-xl bg-white/80 border border-gray-200 dark:bg-slate-800/80 dark:border-slate-700 py-1 focus:outline-none backdrop-blur-sm z-50'
//               role='menu'
//               aria-orientation='vertical'
//             >
//               {fileDropdownItems.map((item, index) => {
//                 if (item.type === "label")
//                   return (
//                     <CustomDropdownLabel key={`label-${index}`}>
//                       {item.label}
//                     </CustomDropdownLabel>
//                   );
//                 if (item.type === "separator")
//                   return <CustomDropdownSeparator key={`sep-${index}`} />;
//                 return (
//                   <CustomDropdownItem
//                     key={item.label}
//                     onClick={() => {
//                       item.action();
//                       setIsFileDropdownOpen(false);
//                     }}
//                     disabled={item.disabled}
//                     icon={item.icon}
//                     iconSize={iconSize}
//                     iconStrokeWidth={iconStrokeWidth}
//                   >
//                     {item.label}
//                   </CustomDropdownItem>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={toggleFullscreen}
//               variant='ghost'
//               size='icon'
//               className='w-9 h-9 text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-purple-300'
//             >
//               {isFullscreen ? (
//                 <Minimize size={iconSize} />
//               ) : (
//                 <Maximize size={iconSize} />
//               )}
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent
//             side='bottom'
//             className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//           >
//             <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
//           </TooltipContent>
//         </Tooltip>

//         <Button
//           variant={isRightSidebarOpen ? "default" : "ghost"}
//           size='icon'
//           onClick={toggleRightSidebar}
//           className='md:hidden w-9 h-9 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/70 data-[state=open]:bg-blue-600 dark:data-[state=open]:bg-purple-600 active:bg-blue-700 dark:active:bg-purple-700 data-[state=open]:text-white'
//           aria-label='Toggle Properties Panel'
//         >
//           <PanelRight size={iconSize + 2} />
//         </Button>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator as UiSeparator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";

import {
  Play,
  Pause,
  Archive,
  Image as ImageIconLucide,
  Film,
  FileText,
  FilePlus,
  Undo2,
  Redo2,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyStart,
  Layers,
  Target,
  LayoutPanelLeft,
  UploadCloud,
  Maximize,
  Minimize,
  PanelLeft,
  PanelRight,
  RefreshCw,
} from "lucide-react";

// Custom Dropdown Item Component with light/dark mode support
const CustomDropdownItem = ({
  onClick,
  disabled,
  children,
  icon: IconComponent,
  iconSize,
  iconStrokeWidth,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full text-left px-3 py-2 text-sm flex items-center rounded-sm transition-colors duration-150",
      "text-gray-700 dark:text-slate-200",
      "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-purple-600/30 dark:hover:text-purple-200",
      "focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-purple-600/30 dark:focus:text-purple-200 focus:outline-none",
      "cursor-pointer",
      disabled &&
        "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
    )}
  >
    {IconComponent && (
      <IconComponent
        size={iconSize - 2}
        strokeWidth={iconStrokeWidth}
        className='mr-2 text-gray-500 dark:text-slate-400'
      />
    )}
    {children}
  </button>
);

// Custom Dropdown Label with light/dark mode support
const CustomDropdownLabel = ({ children }) => (
  <div className='px-3 py-1.5 text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide'>
    {children}
  </div>
);

// Custom Dropdown Separator with light/dark mode support
const CustomDropdownSeparator = () => (
  <div className='my-1 h-px bg-gray-200 dark:bg-slate-700'></div>
);

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
  isFullscreen,
  toggleFullscreen,
  toggleLeftSidebar,
  toggleRightSidebar,
  isLeftSidebarOpen,
  isRightSidebarOpen,
  forceRefreshCanvas,
}) {
  const iconSize = 16;
  const iconStrokeWidth = 1.5;

  const [isAlignDropdownOpen, setIsAlignDropdownOpen] = useState(false);
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);

  const alignDropdownRef = useRef(null);
  const fileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        alignDropdownRef.current &&
        !alignDropdownRef.current.contains(event.target)
      ) {
        setIsAlignDropdownOpen(false);
      }
      if (
        fileDropdownRef.current &&
        !fileDropdownRef.current.contains(event.target)
      ) {
        setIsFileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdowns when ESC is pressed
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsAlignDropdownOpen(false);
        setIsFileDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Updated base class with light/dark mode support
  const buttonBaseClass =
    "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100 dark:hover:border-slate-500 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";

  const iconButtonClass = cn(
    buttonBaseClass,
    "w-9 h-9 p-0 flex items-center justify-center shrink-0"
  );

  const alignDropdownItems = [
    { type: "label", label: "Align All Shapes" },
    {
      label: "Horizontally (Avg X)",
      action: () => alignAllShapes("x", "average"),
      icon: AlignHorizontalJustifyStart,
      disabled: isBaking || shapesCount < 2,
    },
    {
      label: "Vertically (Avg Y)",
      action: () => alignAllShapes("y", "average"),
      icon: AlignVerticalJustifyStart,
      disabled: isBaking || shapesCount < 2,
    },
    {
      label: "By Depth (Avg Z)",
      action: () => alignAllShapes("z", "average"),
      icon: Layers,
      disabled: isBaking || shapesCount < 2,
    },
    { type: "separator" },
    { type: "label", label: "Align Selected to Origin" },
    {
      label: "X to Origin",
      action: () => alignSelectedShapeToOrigin("x"),
      icon: Target,
      disabled: isBaking || !selectedShapeId,
    },
    {
      label: "Y to Origin",
      action: () => alignSelectedShapeToOrigin("y"),
      icon: Target,
      disabled: isBaking || !selectedShapeId,
    },
    {
      label: "Z to Origin",
      action: () => alignSelectedShapeToOrigin("z"),
      icon: Target,
      disabled: isBaking || !selectedShapeId,
    },
  ];

  const fileDropdownItems = [
    { type: "label", label: "Import" },
    {
      label: "Import JSON Scene",
      action: triggerJsonFileImport,
      icon: FilePlus,
      disabled: isBaking,
    },
    {
      label: "Import GLB/GLTF",
      action: triggerGlbFileImport,
      icon: UploadCloud,
      disabled: isBaking,
    },
    {
      label: "Import Image Plane",
      action: triggerImageFileImport,
      icon: ImageIconLucide,
      disabled: isBaking,
    },
    { type: "separator" },
    { type: "label", label: "Export" },
    {
      label: "Export Scene to JSON",
      action: exportJSON,
      icon: FileText,
      disabled: isBaking,
    },
    {
      label: "Export Static GLB",
      action: exportStaticGLBFile,
      icon: Layers,
      disabled: isBaking,
    },
    {
      label: "Export Animated GLB",
      action: bakeAndExportAnimatedGLB,
      icon: Film,
      disabled: isBaking,
    },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex items-center px-3 sm:px-4 py-2.5 sm:py-3",
        "bg-white/95 backdrop-blur-md border-b border-gray-200",
        "dark:bg-slate-900/95 dark:border-slate-700/60",
        "shadow-lg sticky top-0",
        // Proper z-index: Above content but below modals/overlays
        "z-50",
        // Performance optimizations
        "transform-gpu will-change-transform"
      )}
    >
      {/* Left Section */}
      <div className='flex items-center space-x-2 sm:space-x-3 shrink-0'>
        <Button
          variant={isLeftSidebarOpen ? "default" : "ghost"}
          size='icon'
          onClick={toggleLeftSidebar}
          className='md:hidden w-9 h-9 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/70 data-[state=open]:bg-blue-600 dark:data-[state=open]:bg-purple-600 active:bg-blue-700 dark:active:bg-purple-700 data-[state=open]:text-white'
          aria-label='Toggle Tools Panel'
        >
          <PanelLeft size={iconSize + 2} />
        </Button>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-pink-500 dark:to-orange-400 rounded-lg flex items-center justify-center shadow-lg shrink-0'
        >
          <span className='text-white font-bold text-lg sm:text-xl tracking-tighter'>
            3D
          </span>
        </motion.div>

        <div className='hidden sm:block'>
          <h1 className='text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent'>
            Creator Pro
          </h1>
          <p className='text-xs text-gray-500 dark:text-slate-400 hidden md:block'>
            Design & Export Tool
          </p>
        </div>

        <Badge
          variant='outline'
          className='bg-gray-100 border-blue-300 text-blue-700 dark:bg-slate-700/50 dark:border-purple-500/50 dark:text-purple-300 text-xs px-1.5 sm:px-2 py-0.5 hidden xs:inline-flex'
        >
          v2.8
        </Badge>
      </div>

      {/* Center Section */}
      <div className='flex-1 flex justify-center items-center space-x-1 sm:space-x-1.5 px-2 sm:px-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleGlobalAnimation}
              variant='outline'
              size='sm'
              className={cn(buttonBaseClass, "w-auto px-2 sm:px-3 h-9")}
              disabled={isBaking}
            >
              {isAnimating ? (
                <Pause
                  size={iconSize}
                  strokeWidth={iconStrokeWidth}
                  className='sm:mr-1.5'
                />
              ) : (
                <Play
                  size={iconSize}
                  strokeWidth={iconStrokeWidth}
                  className='sm:mr-1.5'
                />
              )}
              <span className='hidden sm:inline'>
                {isAnimating ? "Pause" : "Play"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          >
            <p>
              {isAnimating
                ? "Pause all animations (P)"
                : "Play all animations (P)"}
            </p>
          </TooltipContent>
        </Tooltip>

        <UiSeparator
          orientation='vertical'
          className='h-5 bg-gray-300 dark:bg-slate-700'
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={undo}
              disabled={undoStackLength === 0 || isBaking}
              variant='outline'
              size='icon'
              className={iconButtonClass}
            >
              <Undo2 size={iconSize} strokeWidth={iconStrokeWidth} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          >
            Undo (Ctrl+Z)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={redo}
              disabled={redoStackLength === 0 || isBaking}
              variant='outline'
              size='icon'
              className={iconButtonClass}
            >
              <Redo2 size={iconSize} strokeWidth={iconStrokeWidth} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          >
            Redo (Ctrl+Y)
          </TooltipContent>
        </Tooltip>

        <UiSeparator
          orientation='vertical'
          className='h-5 bg-gray-300 dark:bg-slate-700'
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={forceRefreshCanvas}
              variant='outline'
              size='icon'
              className={iconButtonClass}
              disabled={isBaking}
            >
              <RefreshCw size={iconSize - 1} strokeWidth={iconStrokeWidth} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          >
            <p>Refresh Canvas View</p>
          </TooltipContent>
        </Tooltip>

        {/* Align Dropdown */}
        <div className='relative' ref={alignDropdownRef}>
          <Button
            variant='outline'
            size='sm'
            className={cn(
              buttonBaseClass,
              "px-2 sm:px-3 h-9 flex items-center",
              isAlignDropdownOpen && "bg-gray-100 dark:bg-slate-700/70"
            )}
            disabled={isBaking}
            onClick={() => setIsAlignDropdownOpen((prev) => !prev)}
            aria-haspopup='true'
            aria-expanded={isAlignDropdownOpen}
          >
            <LayoutPanelLeft
              size={iconSize}
              strokeWidth={iconStrokeWidth}
              className='xs:mr-1.5'
            />
            <span className='hidden xs:inline'>Align</span>
          </Button>
          {isAlignDropdownOpen && (
            <div
              className={cn(
                "absolute left-0 mt-1.5 w-56 origin-top-left rounded-md shadow-xl",
                "bg-white/98 backdrop-blur-md border border-gray-200",
                "dark:bg-slate-800/98 dark:border-slate-700",
                "py-1 focus:outline-none",
                // Ensure dropdown is above toolbar
                "z-[100]",
                // Animation classes
                "animate-in fade-in-0 zoom-in-95 duration-100"
              )}
              role='menu'
              aria-orientation='vertical'
            >
              {alignDropdownItems.map((item, index) => {
                if (item.type === "label")
                  return (
                    <CustomDropdownLabel key={`label-${index}`}>
                      {item.label}
                    </CustomDropdownLabel>
                  );
                if (item.type === "separator")
                  return <CustomDropdownSeparator key={`sep-${index}`} />;
                return (
                  <CustomDropdownItem
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setIsAlignDropdownOpen(false);
                    }}
                    disabled={item.disabled}
                    icon={item.icon}
                    iconSize={iconSize}
                    iconStrokeWidth={iconStrokeWidth}
                  >
                    {item.label}
                  </CustomDropdownItem>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className='flex items-center space-x-1 sm:space-x-1.5 shrink-0'>
        {/* File Dropdown */}
        <div className='relative' ref={fileDropdownRef}>
          <Button
            variant='outline'
            size='sm'
            className={cn(
              buttonBaseClass,
              "px-2 sm:px-3 h-9 flex items-center",
              isFileDropdownOpen && "bg-gray-100 dark:bg-slate-700/70"
            )}
            disabled={isBaking}
            onClick={() => setIsFileDropdownOpen((prev) => !prev)}
            aria-haspopup='true'
            aria-expanded={isFileDropdownOpen}
          >
            <Archive
              size={iconSize}
              strokeWidth={iconStrokeWidth}
              className='xs:mr-1.5'
            />
            <span className='hidden xs:inline'>File</span>
          </Button>
          {isFileDropdownOpen && (
            <div
              className={cn(
                "absolute right-0 mt-1.5 w-56 origin-top-right rounded-md shadow-xl",
                "bg-white/98 backdrop-blur-md border border-gray-200",
                "dark:bg-slate-800/98 dark:border-slate-700",
                "py-1 focus:outline-none",
                // Ensure dropdown is above toolbar
                "z-[100]",
                // Animation classes
                "animate-in fade-in-0 zoom-in-95 duration-100"
              )}
              role='menu'
              aria-orientation='vertical'
            >
              {fileDropdownItems.map((item, index) => {
                if (item.type === "label")
                  return (
                    <CustomDropdownLabel key={`label-${index}`}>
                      {item.label}
                    </CustomDropdownLabel>
                  );
                if (item.type === "separator")
                  return <CustomDropdownSeparator key={`sep-${index}`} />;
                return (
                  <CustomDropdownItem
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setIsFileDropdownOpen(false);
                    }}
                    disabled={item.disabled}
                    icon={item.icon}
                    iconSize={iconSize}
                    iconStrokeWidth={iconStrokeWidth}
                  >
                    {item.label}
                  </CustomDropdownItem>
                );
              })}
            </div>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleFullscreen}
              variant='ghost'
              size='icon'
              className='w-9 h-9 text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-purple-300'
            >
              {isFullscreen ? (
                <Minimize size={iconSize} />
              ) : (
                <Maximize size={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
          >
            <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant={isRightSidebarOpen ? "default" : "ghost"}
          size='icon'
          onClick={toggleRightSidebar}
          className='md:hidden w-9 h-9 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/70 data-[state=open]:bg-blue-600 dark:data-[state=open]:bg-purple-600 active:bg-blue-700 dark:active:bg-purple-700 data-[state=open]:text-white'
          aria-label='Toggle Properties Panel'
        >
          <PanelRight size={iconSize + 2} />
        </Button>
      </div>
    </motion.div>
  );
}
