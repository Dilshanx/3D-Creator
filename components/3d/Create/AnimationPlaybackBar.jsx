import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, StopCircle, Repeat, Disc3 } from "lucide-react";
// import { cn } from "@/lib/utils"; // cn is not used in this version of the file

const AnimationPlaybackBar = ({
  animationClips,
  selectedAnimationClipIndex,
  onAnimationClipChange,
  animationPlaybackState,
  onPlayPauseAnimation,
  onStopAnimation,
  isAnimationLooping,
  onAnimationLoopToggle,
  animationTime,
  onAnimationTimeChange,
  animationDuration,
  animationPlaybackSpeed,
  onAnimationSpeedChange,
  playAllAnimations,
  onPlayAllAnimationsToggle,
}) => {
  if (!animationClips || animationClips.length === 0) {
    return null;
  }

  const handleTimeSliderChange = (valueArray) => {
    if (onAnimationTimeChange) onAnimationTimeChange(valueArray[0]);
  };
  const handleSpeedSliderChange = (valueArray) => {
    if (onAnimationSpeedChange) onAnimationSpeedChange(valueArray[0]);
  };

  return (
    <Card className='bg-slate-800/80 backdrop-blur-md border border-slate-700/60 shadow-xl rounded-none md:rounded-lg'>
      <CardHeader className='pb-2 pt-3 px-3 sm:pb-3 sm:pt-4 sm:px-4'>
        <CardTitle className='text-sm sm:text-base text-slate-100 flex items-center'>
          {/* CORRECTED: Removed sm:size prop, using a single size */}
          <Disc3 size={18} className='mr-2 text-purple-400' />
          Animation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className='px-3 pb-3 sm:px-4 sm:pb-4 space-y-2.5 sm:space-y-3'>
        {animationClips.length > 1 && !playAllAnimations && (
          <div className='space-y-1.5'>
            <Label
              htmlFor='animationClipSelect'
              className='text-xs text-slate-400'
            >
              {" "}
              Animation Clip{" "}
            </Label>
            <Select
              value={selectedAnimationClipIndex.toString()}
              onValueChange={onAnimationClipChange}
              disabled={playAllAnimations}
            >
              <SelectTrigger
                id='animationClipSelect'
                className='w-full bg-slate-700 border-slate-600 text-slate-200 text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 h-9'
              >
                <SelectValue placeholder='Select clip' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-200'>
                {animationClips.map((clip, index) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    className='text-xs focus:bg-purple-600/80 focus:text-white'
                  >
                    {clip.name || `Animation #${index + 1}`} (
                    {(clip.duration || 0).toFixed(2)}s)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='flex items-center space-x-1.5 sm:space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={onPlayPauseAnimation}
            className='h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
            title={animationPlaybackState === "playing" ? "Pause" : "Play"}
          >
            {animationPlaybackState === "playing" ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={onStopAnimation}
            className='h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
            title='Stop'
          >
            <StopCircle size={14} />
          </Button>
          <div className='flex-grow space-y-0.5'>
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={[animationTime]}
              onValueChange={handleTimeSliderChange}
              disabled={
                animationPlaybackState === "stopped" || animationDuration === 0
              }
              title={`Time: ${(animationTime * animationDuration).toFixed(
                2
              )}s / ${animationDuration.toFixed(2)}s`}
            />
            <div className='text-[10px] sm:text-xs text-slate-400 text-right pr-1'>
              {(animationTime * animationDuration).toFixed(2)}s /{" "}
              {animationDuration > 0 ? animationDuration.toFixed(2) : "N/A"}s
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-x-4 sm:gap-y-3 items-center pt-1'>
          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <Label
                htmlFor='animationSpeedSlider'
                className='text-xs text-slate-400'
              >
                {" "}
                Speed{" "}
              </Label>
              <span className='text-xs text-slate-400'>
                {" "}
                {animationPlaybackSpeed.toFixed(1)}x{" "}
              </span>
            </div>
            <Slider
              id='animationSpeedSlider'
              min={0.1}
              max={3.0}
              step={0.1}
              value={[animationPlaybackSpeed]}
              onValueChange={handleSpeedSliderChange}
            />
          </div>

          <div className='flex items-center space-x-2 justify-self-start xs:justify-self-end'>
            <Switch
              id='animationLoopToggle'
              checked={isAnimationLooping}
              onCheckedChange={onAnimationLoopToggle}
              className='data-[state=checked]:bg-purple-600'
            />
            <Label
              htmlFor='animationLoopToggle'
              className='text-xs text-slate-400 flex items-center'
            >
              {" "}
              Loop <Repeat size={12} className='inline ml-1 opacity-70' />{" "}
            </Label>
          </div>

          {animationClips.length > 1 && (
            <div className='flex items-center space-x-2 col-span-1 xs:col-span-2 justify-center pt-1 xs:pt-2'>
              <Switch
                id='playAllAnimationsToggle'
                checked={playAllAnimations}
                onCheckedChange={onPlayAllAnimationsToggle}
                className='data-[state=checked]:bg-purple-600'
              />
              <Label
                htmlFor='playAllAnimationsToggle'
                className='text-xs text-slate-400 text-center xs:text-left'
              >
                {" "}
                Play All Clips{" "}
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimationPlaybackBar;
