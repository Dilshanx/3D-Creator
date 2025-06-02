import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

export default function StatusBar({ shapesCount, selectedShape }) {
  const selectedInfo = selectedShape
    ? selectedShape.type === "text"
      ? `Text: "${selectedShape.text?.substring(0, 10) || "Empty"}${
          // Shorter preview
          (selectedShape.text?.length || 0) > 10 ? "..." : ""
        }"`
      : selectedShape.type === "importedGLB"
      ? selectedShape.name || "Imported Model"
      : selectedShape.type === "imagePlane"
      ? selectedShape.name || "Image Plane"
      : selectedShape.name ||
        selectedShape.type?.charAt(0).toUpperCase() +
          selectedShape.type?.slice(1)
    : "None";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className={cn(
        "flex flex-col xs:flex-row justify-between items-center px-3 py-1.5 sm:px-4 sm:py-2", // Responsive padding
        "bg-slate-900/70 backdrop-blur-sm border-t border-slate-700/50 shadow-lg",
        "text-xs text-slate-400"
      )}
    >
      <div className='flex items-center space-x-2 mb-1 xs:mb-0'>
        {" "}
        {/* Spacing adjusted */}
        <div className='flex items-center space-x-1'>
          <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ring-1 ring-green-400/30'></div>
          <span className='text-slate-300'>
            {shapesCount} {shapesCount === 1 ? "Object" : "Objects"}
          </span>
        </div>
        {selectedShape && (
          <>
            <Separator
              orientation='vertical'
              className='h-3 bg-slate-700 hidden xs:block'
            />
            <span
              className='truncate max-w-[150px] xs:max-w-[180px] sm:max-w-[220px] text-slate-300 block xs:inline'
              title={selectedInfo}
            >
              <span className='hidden xs:inline'>Selected: </span>
              <span className='text-purple-300'>{selectedInfo}</span>
            </span>
          </>
        )}
      </div>
      <div className='text-slate-500 text-center xs:text-right text-[10px] sm:text-xs leading-tight'>
        Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
      </div>
    </motion.div>
  );
}
