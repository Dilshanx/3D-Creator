import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { ANIMATION_PRESETS_DATA } from "../lib/constants";

export const AnimationControls = ({
  isAnimating,
  onToggleAnimation,
  onResetAnimation,
  animationPreset,
  onPresetChange,
  onRandomize,
}) => (
  <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
    <CardHeader>
      <CardTitle className='text-slate-100 text-lg'>Animation</CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      <Button
        onClick={onToggleAnimation}
        variant={isAnimating ? "destructive" : "default"}
        className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
        data-state={isAnimating ? "destructive" : "default"}
      >
        {isAnimating ? (
          <Pause size={16} className='mr-2' />
        ) : (
          <Play size={16} className='mr-2' />
        )}
        {isAnimating ? "Pause" : "Play"}
      </Button>
      <Select value={animationPreset} onValueChange={onPresetChange}>
        <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
          <SelectValue placeholder='Select animation preset' />
        </SelectTrigger>
        <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
          {Object.keys(ANIMATION_PRESETS_DATA).map((presetKey) => (
            <SelectItem
              key={presetKey}
              value={presetKey}
              className='capitalize focus:bg-purple-600 focus:text-white'
            >
              {presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='grid grid-cols-2 gap-3'>
        <Button
          variant='outline'
          onClick={onResetAnimation}
          className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
        >
          <RotateCcw size={14} className='mr-2' /> Reset
        </Button>
        <Button
          variant='default'
          onClick={onRandomize}
          className='bg-indigo-600 hover:bg-indigo-700'
        >
          <Shuffle size={14} className='mr-2' /> Random
        </Button>
      </div>
    </CardContent>
  </Card>
);
