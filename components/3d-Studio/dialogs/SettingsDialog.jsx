import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { BACKGROUND_OPTIONS_DATA } from "../lib/constants";
import { Sun, Moon } from "lucide-react";

export const SettingsDialog = ({
  show,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!show) return null;

  const handleSliderChange = (name, value) => {
    onSettingsChange((s) => ({ ...s, [name]: value[0] }));
  };

  const handleSelectChange = (name, value) => {
    onSettingsChange((s) => ({ ...s, [name]: value }));
  };

  const handleInputChange = (name, value) => {
    onSettingsChange((s) => ({ ...s, [name]: value }));
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className='bg-slate-800 border-slate-700 text-slate-100 sm:max-w-[525px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Viewer Settings</DialogTitle>
          <DialogDescription className='text-slate-400'>
            Customize appearance and behavior.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-6 py-4'>
          {/* Material & Shape Settings */}
          <Label className='col-span-4 text-lg font-medium text-purple-400 -mb-2'>
            Model & Shape
          </Label>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='materialType'
              className='text-right col-span-1 text-slate-300'
            >
              Material
            </Label>
            <Select
              value={settings.materialType}
              onValueChange={(value) =>
                handleSelectChange("materialType", value)
              }
            >
              <SelectTrigger
                id='materialType'
                className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
              >
                <SelectValue placeholder='Select material' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {[
                  "auto",
                  "metallic",
                  "glass",
                  "crystal",
                  "ceramic",
                  "organic",
                  "plastic",
                  "neon",
                ].map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className='capitalize focus:bg-purple-600 focus:text-white'
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='shapeColor'
              className='text-right col-span-1 text-slate-300'
            >
              Color
            </Label>
            <Input
              id='shapeColor'
              type='color'
              value={settings.shapeColor}
              onChange={(e) => handleInputChange("shapeColor", e.target.value)}
              className='col-span-3 p-1 h-10 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='extrudeDepth'
              className='text-right col-span-1 text-slate-300'
            >
              Depth (Shapes)
            </Label>
            <Slider
              id='extrudeDepth'
              min={0.05}
              max={1.5}
              step={0.05}
              value={[settings.extrudeDepth]}
              onValueChange={(value) =>
                handleSliderChange("extrudeDepth", value)
              }
              className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
            <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
              {settings.extrudeDepth.toFixed(2)}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='quality'
              className='text-right col-span-1 text-slate-300'
            >
              Quality (Shapes)
            </Label>
            <Select
              value={settings.quality}
              onValueChange={(value) => handleSelectChange("quality", value)}
            >
              <SelectTrigger
                id='quality'
                className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
              >
                <SelectValue placeholder='Select quality' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {["low", "medium", "high"].map((q) => (
                  <SelectItem
                    key={q}
                    value={q}
                    className='capitalize focus:bg-purple-600 focus:text-white'
                  >
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className='my-2 bg-slate-700' />
          {/* Animation & General Scene Settings */}
          <Label className='col-span-4 text-lg font-medium text-purple-400 -mb-2'>
            Scene & Animation
          </Label>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='animationSpeed'
              className='text-right col-span-1 text-slate-300'
            >
              Anim. Speed
            </Label>
            <Slider
              id='animationSpeed'
              min={0.1}
              max={3}
              step={0.1}
              value={[settings.animationSpeed]}
              onValueChange={(value) =>
                handleSliderChange("animationSpeed", value)
              }
              className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
            <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
              {settings.animationSpeed.toFixed(1)}x
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='background'
              className='text-right col-span-1 text-slate-300'
            >
              Background
            </Label>
            <Select
              value={settings.background}
              onValueChange={(value) => handleSelectChange("background", value)}
            >
              <SelectTrigger
                id='background'
                className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
              >
                <SelectValue placeholder='Select background' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {Object.entries(BACKGROUND_OPTIONS_DATA).map(([key, name]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className='focus:bg-purple-600 focus:text-white'
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className='my-2 bg-slate-700' />
          {/* Lighting Settings */}
          <Label className='col-span-4 text-lg font-medium text-purple-400 -mb-2'>
            Scene Lighting
          </Label>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='sceneAmbientLightIntensity'
              className='text-right col-span-1 text-slate-300 flex items-center justify-end gap-1.5'
            >
              <Moon size={14} /> Ambient
            </Label>
            <Slider
              id='sceneAmbientLightIntensity'
              min={0}
              max={2}
              step={0.05}
              value={[settings.sceneAmbientLightIntensity]}
              onValueChange={(value) =>
                handleSliderChange("sceneAmbientLightIntensity", value)
              }
              className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
            <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
              {settings.sceneAmbientLightIntensity.toFixed(2)}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='sceneKeyLightIntensity'
              className='text-right col-span-1 text-slate-300 flex items-center justify-end gap-1.5'
            >
              <Sun size={14} /> Key Light
            </Label>
            <Slider
              id='sceneKeyLightIntensity'
              min={0}
              max={3}
              step={0.1}
              value={[settings.sceneKeyLightIntensity]}
              onValueChange={(value) =>
                handleSliderChange("sceneKeyLightIntensity", value)
              }
              className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
            <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
              {settings.sceneKeyLightIntensity.toFixed(1)}
            </span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='sceneEnvMapIntensity'
              className='text-right col-span-1 text-slate-300'
            >
              Environment
            </Label>
            <Slider
              id='sceneEnvMapIntensity'
              min={0}
              max={3}
              step={0.1}
              value={[settings.sceneEnvMapIntensity]}
              onValueChange={(value) =>
                handleSliderChange("sceneEnvMapIntensity", value)
              }
              className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
            <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
              {settings.sceneEnvMapIntensity.toFixed(1)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
