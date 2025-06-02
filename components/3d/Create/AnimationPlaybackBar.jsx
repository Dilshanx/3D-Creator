// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Play, Pause, StopCircle, Repeat, Disc3 } from "lucide-react";

// const AnimationPlaybackBar = ({
//   animationClips,
//   selectedAnimationClipIndex,
//   onAnimationClipChange,
//   animationPlaybackState, // 'playing', 'paused', 'stopped'
//   onPlayPauseAnimation,
//   onStopAnimation,
//   isAnimationLooping,
//   onAnimationLoopToggle,
//   animationTime, // Normalized 0-1
//   onAnimationTimeChange, // Expects normalized value
//   animationDuration, // Actual duration in seconds
//   animationPlaybackSpeed,
//   onAnimationSpeedChange,
//   playAllAnimations,
//   onPlayAllAnimationsToggle,
// }) => {
//   if (!animationClips || animationClips.length === 0) {
//     return null;
//   }

//   const handleTimeSliderChange = (valueArray) => {
//     if (onAnimationTimeChange) onAnimationTimeChange(valueArray[0]);
//   };

//   const handleSpeedSliderChange = (valueArray) => {
//     if (onAnimationSpeedChange) onAnimationSpeedChange(valueArray[0]);
//   };

//   return (
//     <Card className='mt-4 bg-card/80 backdrop-blur-md border-border/60 shadow-lg'>
//       <CardHeader className='pb-3 pt-4 px-4'>
//         <CardTitle className='text-base text-foreground flex items-center'>
//           <Disc3 size={18} className='mr-2 text-primary' />
//           Animation Controls
//         </CardTitle>
//       </CardHeader>
//       <CardContent className='px-4 pb-4 space-y-3'>
//         {animationClips.length > 1 && !playAllAnimations && (
//           <div className='space-y-1.5'>
//             <Label
//               htmlFor='animationClipSelect'
//               className='text-xs text-muted-foreground'
//             >
//               Animation Clip
//             </Label>
//             <Select
//               value={selectedAnimationClipIndex.toString()}
//               onValueChange={onAnimationClipChange}
//               disabled={playAllAnimations}
//             >
//               <SelectTrigger
//                 id='animationClipSelect'
//                 className='w-full bg-background border-border text-foreground text-xs focus:ring-primary'
//               >
//                 <SelectValue placeholder='Select clip' />
//               </SelectTrigger>
//               <SelectContent className='bg-background border-border text-foreground'>
//                 {animationClips.map((clip, index) => (
//                   <SelectItem
//                     key={index}
//                     value={index.toString()}
//                     className='text-xs focus:bg-primary/20 focus:text-primary-foreground'
//                   >
//                     {clip.name || `Animation #${index + 1}`} (
//                     {(clip.duration || 0).toFixed(2)}s)
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         <div className='flex items-center space-x-2'>
//           <Button
//             variant='outline'
//             size='icon'
//             onClick={onPlayPauseAnimation}
//             className='h-8 w-8'
//             title={animationPlaybackState === "playing" ? "Pause" : "Play"}
//           >
//             {animationPlaybackState === "playing" ? (
//               <Pause size={14} />
//             ) : (
//               <Play size={14} />
//             )}
//           </Button>
//           <Button
//             variant='outline'
//             size='icon'
//             onClick={onStopAnimation}
//             className='h-8 w-8'
//             title='Stop'
//           >
//             <StopCircle size={14} />
//           </Button>
//           <div className='flex-grow space-y-1'>
//             <Slider
//               min={0}
//               max={1}
//               step={0.001}
//               value={[animationTime]}
//               onValueChange={handleTimeSliderChange}
//               disabled={
//                 animationPlaybackState === "stopped" || animationDuration === 0
//               }
//               className='[&>span:first-child]:h-1.5 [&>span>span]:bg-primary [&>span>span]:h-2.5 [&>span>span]:w-3'
//               title={`Time: ${(animationTime * animationDuration).toFixed(
//                 2
//               )}s / ${animationDuration.toFixed(2)}s`}
//             />
//             <div className='text-xs text-muted-foreground text-right'>
//               {(animationTime * animationDuration).toFixed(2)}s /{" "}
//               {animationDuration > 0 ? animationDuration.toFixed(2) : "N/A"}s
//             </div>
//           </div>
//         </div>

//         <div className='grid grid-cols-2 gap-x-4 gap-y-3 items-center pt-1'>
//           <div className='space-y-1.5'>
//             <div className='flex justify-between items-center'>
//               <Label
//                 htmlFor='animationSpeedSlider'
//                 className='text-xs text-muted-foreground'
//               >
//                 Speed
//               </Label>
//               <span className='text-xs text-muted-foreground'>
//                 {animationPlaybackSpeed.toFixed(1)}x
//               </span>
//             </div>
//             <Slider
//               id='animationSpeedSlider'
//               min={0.1}
//               max={3.0}
//               step={0.1}
//               value={[animationPlaybackSpeed]}
//               onValueChange={handleSpeedSliderChange}
//               className='[&>span:first-child]:h-1.5 [&>span>span]:bg-primary [&>span>span]:h-2.5 [&>span>span]:w-3'
//             />
//           </div>

//           <div className='flex items-center space-x-2 justify-self-end'>
//             <Switch
//               id='animationLoopToggle'
//               checked={isAnimationLooping}
//               onCheckedChange={onAnimationLoopToggle}
//               className='data-[state=checked]:bg-primary'
//             />
//             <Label
//               htmlFor='animationLoopToggle'
//               className='text-xs text-muted-foreground'
//             >
//               Loop <Repeat size={12} className='inline ml-1' />
//             </Label>
//           </div>

//           {animationClips.length > 1 && (
//             <div className='flex items-center space-x-2 col-span-2 justify-center pt-2'>
//               <Switch
//                 id='playAllAnimationsToggle'
//                 checked={playAllAnimations}
//                 onCheckedChange={onPlayAllAnimationsToggle}
//                 className='data-[state=checked]:bg-primary'
//               />
//               <Label
//                 htmlFor='playAllAnimationsToggle'
//                 className='text-xs text-muted-foreground'
//               >
//                 Play All Clips Simultaneously
//               </Label>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AnimationPlaybackBar;

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  StopCircle,
  RotateCcw,
  Repeat,
  ListFilter,
} from "lucide-react";

export default function AnimationPlaybackBar({
  animationClips = [],
  selectedAnimationClipIndex,
  onAnimationClipChange,
  animationPlaybackState,
  onPlayPauseAnimation,
  onStopAnimation,
  isAnimationLooping,
  onAnimationLoopToggle,
  animationTime, // Normalized 0-1
  onAnimationTimeChange, // Expects normalized 0-1
  animationDuration, // Actual duration in seconds
  animationPlaybackSpeed,
  onAnimationSpeedChange,
  playAllAnimations,
  onPlayAllAnimationsToggle,
}) {
  if (!animationClips || animationClips.length === 0) {
    return null; // Don't render if no clips
  }

  const handleSliderChange = (value) => {
    onAnimationTimeChange(value[0]); // Slider gives array, take first element
  };

  return (
    <div className='p-3 bg-background/80 backdrop-blur-sm border-t border-border/60 text-sm space-y-3'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2 flex-grow'>
          <Select
            value={
              playAllAnimations ? "-1" : String(selectedAnimationClipIndex)
            }
            onValueChange={(val) => onAnimationClipChange(val)}
            disabled={playAllAnimations && animationClips.length <= 1}
          >
            <SelectTrigger
              className='h-8 text-xs w-[180px] truncate'
              title={
                playAllAnimations
                  ? "All Animations"
                  : animationClips[selectedAnimationClipIndex]?.name ||
                    "Select Animation"
              }
            >
              <ListFilter className='h-3 w-3 mr-1.5 text-muted-foreground' />
              <SelectValue placeholder='Select Animation' />
            </SelectTrigger>
            <SelectContent>
              {animationClips.map((clip, index) => (
                <SelectItem
                  key={index}
                  value={String(index)}
                  className='text-xs'
                >
                  {clip.name || `Animation ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {animationClips.length > 1 && (
            <div className='flex items-center space-x-1.5'>
              <Checkbox
                id='playAllAnims'
                checked={playAllAnimations}
                onCheckedChange={onPlayAllAnimationsToggle}
              />
              <Label htmlFor='playAllAnims' className='text-xs font-normal'>
                Play All
              </Label>
            </div>
          )}
        </div>

        <div className='flex items-center gap-1'>
          <Button
            onClick={onPlayPauseAnimation}
            variant='ghost'
            size='icon_sm'
            title={animationPlaybackState === "playing" ? "Pause" : "Play"}
          >
            {animationPlaybackState === "playing" ? (
              <Pause className='h-4 w-4' />
            ) : (
              <Play className='h-4 w-4' />
            )}
          </Button>
          <Button
            onClick={onStopAnimation}
            variant='ghost'
            size='icon_sm'
            title='Stop & Reset'
          >
            <StopCircle className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Slider
          value={[animationTime]}
          onValueChange={handleSliderChange}
          min={0}
          max={1}
          step={0.001}
          className='flex-grow'
          title={`Time: ${(animationTime * animationDuration).toFixed(
            2
          )}s / ${animationDuration.toFixed(2)}s`}
        />
        <span className='text-xs w-20 text-right tabular-nums'>
          {(animationTime * animationDuration).toFixed(2)}s /{" "}
          {animationDuration.toFixed(2)}s
        </span>
      </div>

      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center space-x-1.5'>
          <Checkbox
            id='loopAnim'
            checked={isAnimationLooping}
            onCheckedChange={onAnimationLoopToggle}
          />
          <Label htmlFor='loopAnim' className='text-xs font-normal'>
            Loop
          </Label>
        </div>
        <div className='flex items-center gap-1.5'>
          <Label htmlFor='speedAnim' className='text-xs font-normal'>
            Speed:
          </Label>
          <Input
            type='number'
            id='speedAnim'
            value={animationPlaybackSpeed.toFixed(1)}
            onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
            min='0.1'
            max='5'
            step='0.1'
            className='h-7 w-16 text-xs text-center'
          />
        </div>
      </div>
    </div>
  );
}
