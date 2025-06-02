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
import { cn } from "@/lib/utils";

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

  const buttonBaseClass =
    "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:border-slate-500 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";
  const iconButtonClass = cn(
    buttonBaseClass,
    "w-9 h-9 p-0 flex items-center justify-center shrink-0"
  ); // shrink-0 is good

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // REMOVED justify-between, will use flex-grow on center for spacing
      className='flex items-center px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 shadow-lg sticky top-0 z-30'
    >
      {/* Left Section: Logo, Title, Mobile Toggles */}
      <div className='flex items-center space-x-2 sm:space-x-3 shrink-0'>
        {" "}
        {/* Added shrink-0 to prevent left from taking too much space */}
        <Button
          variant={isLeftSidebarOpen ? "default" : "ghost"}
          size='icon'
          onClick={toggleLeftSidebar}
          className='md:hidden w-9 h-9 text-slate-300 hover:bg-slate-700/70 data-[state=open]:bg-purple-600 active:bg-purple-700 data-[state=open]:text-white'
          aria-label='Toggle Tools Panel'
        >
          {" "}
          <PanelLeft size={iconSize + 2} />{" "}
        </Button>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center shadow-lg shrink-0'
        >
          {" "}
          <span className='text-white font-bold text-lg sm:text-xl tracking-tighter'>
            3D
          </span>{" "}
        </motion.div>
        <div className='hidden sm:block'>
          {" "}
          <h1 className='text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
            {" "}
            Creator Pro{" "}
          </h1>{" "}
          <p className='text-xs text-slate-400 hidden md:block'>
            {" "}
            Design & Export Tool{" "}
          </p>{" "}
        </div>
        <Badge
          variant='outline'
          className='bg-slate-700/50 border-purple-500/50 text-purple-300 text-xs px-1.5 sm:px-2 py-0.5 hidden xs:inline-flex'
        >
          {" "}
          v2.8{" "}
        </Badge>
      </div>

      {/* Center Section: Main Controls - Make this flex-grow */}
      <div className='flex-1 flex justify-center items-center space-x-1 sm:space-x-1.5 px-2 sm:px-4'>
        {" "}
        {/* Added flex-1, justify-center, and some padding */}
        {/* This section should now always try to be visible and take up space */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleGlobalAnimation}
              variant='outline'
              size='sm'
              className={cn(buttonBaseClass, "w-auto px-2 sm:px-3 h-9")}
              disabled={isBaking}
            >
              {" "}
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
              )}{" "}
              <span className='hidden sm:inline'>
                {isAnimating ? "Pause" : "Play"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-slate-800 text-slate-200 border-slate-700'
          >
            <p>
              {isAnimating
                ? "Pause all animations (P)"
                : "Play all animations (P)"}
            </p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation='vertical' className='h-5 bg-slate-700' />{" "}
        {/* Always visible separator */}
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
            className='bg-slate-800 text-slate-200 border-slate-700'
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
            className='bg-slate-800 text-slate-200 border-slate-700'
          >
            Redo (Ctrl+Y)
          </TooltipContent>
        </Tooltip>
        <Separator orientation='vertical' className='h-5 bg-slate-700' />
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
            className='bg-slate-800 text-slate-200 border-slate-700'
          >
            <p>Refresh Canvas View</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn(
                buttonBaseClass,
                "px-2 sm:px-3 h-9 flex items-center"
              )}
              disabled={isBaking}
            >
              <LayoutPanelLeft
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='xs:mr-1.5'
              />{" "}
              <span className='hidden xs:inline'>Align</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='bg-slate-800 border-slate-700 text-slate-200 w-56'
          >
            {/* ... Dropdown items ... */}
            <DropdownMenuLabel className='text-slate-400 px-2 py-1.5 text-xs'>
              Align All Shapes
            </DropdownMenuLabel>
            {[
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
            ].map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className='focus:bg-purple-600/30 focus:text-purple-200 cursor-pointer'
              >
                {" "}
                <item.icon
                  size={iconSize - 2}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2 text-slate-400'
                />{" "}
                {item.label}{" "}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className='bg-slate-700' />
            <DropdownMenuLabel className='text-slate-400 px-2 py-1.5 text-xs'>
              Align Selected to Origin
            </DropdownMenuLabel>
            {[
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
            ].map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className='focus:bg-purple-600/30 focus:text-purple-200 cursor-pointer'
              >
                {" "}
                <item.icon
                  size={iconSize - 2}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2 text-slate-400'
                />{" "}
                {item.label}{" "}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section: File, Fullscreen, Mobile Toggle */}
      <div className='flex items-center space-x-1 sm:space-x-1.5 shrink-0'>
        {" "}
        {/* Added shrink-0 */}
        {/* ... File Dropdown, Fullscreen Button, Mobile Right Toggle ... (unchanged from previous version) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='text-slate-300 hover:bg-slate-700/70 hover:text-slate-100 px-2 sm:px-3 h-9 data-[state=open]:bg-slate-700/70 flex items-center'
              disabled={isBaking}
            >
              <Archive
                size={iconSize}
                strokeWidth={iconStrokeWidth}
                className='xs:mr-1.5'
              />{" "}
              <span className='hidden xs:inline'>File</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='bg-slate-800 border-slate-700 text-slate-200 w-56'
          >
            {[
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
            ].map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className='focus:bg-purple-600/30 focus:text-purple-200 cursor-pointer'
              >
                {" "}
                <item.icon
                  size={iconSize - 2}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2 text-slate-400'
                />{" "}
                {item.label}{" "}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className='bg-slate-700' />
            {[
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
            ].map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className='focus:bg-purple-600/30 focus:text-purple-200 cursor-pointer'
              >
                {" "}
                <item.icon
                  size={iconSize - 2}
                  strokeWidth={iconStrokeWidth}
                  className='mr-2 text-slate-400'
                />{" "}
                {item.label}{" "}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleFullscreen}
              variant='ghost'
              size='icon'
              className='w-9 h-9 text-slate-300 hover:bg-slate-700/70 hover:text-purple-300 data-[state=open]:bg-slate-700/70'
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
            className='bg-slate-800 text-slate-200 border-slate-700'
          >
            <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
          </TooltipContent>
        </Tooltip>
        <Button
          variant={isRightSidebarOpen ? "default" : "ghost"}
          size='icon'
          onClick={toggleRightSidebar}
          className='md:hidden w-9 h-9 text-slate-300 hover:bg-slate-700/70 data-[state=open]:bg-purple-600 active:bg-purple-700 data-[state=open]:text-white'
          aria-label='Toggle Properties Panel'
        >
          {" "}
          <PanelRight size={iconSize + 2} />{" "}
        </Button>
      </div>
    </motion.div>
  );
}
