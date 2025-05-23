// // StatusBar.jsx
// import { motion } from "framer-motion";
// import { Separator } from "@/components/ui/separator";

// export default function StatusBar({ shapesCount, selectedShape }) {
//   return (
//     <motion.div
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay: 0.5 }}
//       className='flex justify-between items-center px-6 py-3 bg-card/80 backdrop-blur-sm border-t border-border/50'
//     >
//       <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
//         <div className='flex items-center space-x-2'>
//           <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
//           <span>
//             {shapesCount} {shapesCount === 1 ? "object" : "objects"} in scene
//           </span>
//         </div>
//         {selectedShape && (
//           <>
//             <Separator orientation='vertical' className='h-4' />
//             <span>
//               Selected:{" "}
//               {
//                 selectedShape.geometry === "text"
//                   ? `Text: "${selectedShape.text || "Empty"}"`
//                   : selectedShape.geometry.charAt(0).toUpperCase() +
//                     selectedShape.geometry.slice(
//                       1
//                     ) /* Ensure selectedShape.geometry is always a string */
//               }
//             </span>
//           </>
//         )}
//       </div>
//       <div className='text-xs text-muted-foreground'>
//         Modern 3D Creator • Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
//       </div>
//     </motion.div>
//   );
// }

// StatusBar.jsx
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function StatusBar({ shapesCount, selectedShape }) {
  const selectedInfo = selectedShape
    ? selectedShape.geometry === "text"
      ? `Text: "${selectedShape.text?.substring(0, 15) || "Empty"}${
          (selectedShape.text?.length || 0) > 15 ? "..." : ""
        }"`
      : selectedShape.geometry.charAt(0).toUpperCase() +
        selectedShape.geometry.slice(1)
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
            <span className='truncate max-w-[200px]'>
              Selected: {selectedInfo}
            </span>
          </>
        )}
      </div>
      <div className='text-muted-foreground'>
        PBR Creator • Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
      </div>
    </motion.div>
  );
}
