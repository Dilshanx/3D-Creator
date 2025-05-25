import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function StatusBar({ shapesCount, selectedShape }) {
  const selectedInfo = selectedShape
    ? selectedShape.type === "text"
      ? `Text: "${selectedShape.text?.substring(0, 15) || "Empty"}${
          (selectedShape.text?.length || 0) > 15 ? "..." : ""
        }"`
      : selectedShape.type === "importedGLB"
      ? selectedShape.name || "Imported Model"
      : selectedShape.type === "imagePlane" // New check
      ? selectedShape.name || "Image Plane"
      : selectedShape.name ||
        selectedShape.type?.charAt(0).toUpperCase() +
          selectedShape.type?.slice(1)
    : "None";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className='flex justify-between items-center px-6 py-3 bg-card/80 backdrop-blur-lg border-t border-border/60 text-xs shadow- ऊपर-md'
    >
      <div className='flex items-center space-x-3 text-muted-foreground'>
        <div className='flex items-center space-x-1.5'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <span>
            {shapesCount} {shapesCount === 1 ? "object" : "objects"}
          </span>
        </div>
        {selectedShape && (
          <>
            <Separator orientation='vertical' className='h-3 bg-border' />
            <span className='truncate max-w-[200px]' title={selectedInfo}>
              Selected: {selectedInfo}
            </span>
            {selectedShape.type === "imagePlane" && selectedShape.name && (
              <span
                className='text-xs opacity-70 truncate max-w-[150px]'
                title={selectedShape.name}
              >
                ({selectedShape.name})
              </span>
            )}
          </>
        )}
      </div>
      <div className='text-muted-foreground'>
        Creator Pro • Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
      </div>
    </motion.div>
  );
}
