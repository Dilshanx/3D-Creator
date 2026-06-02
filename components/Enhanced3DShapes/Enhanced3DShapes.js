
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";

import {
  Box,
  Camera,
  CheckCircle2,
  Crown,
  Diamond,
  Download,
  Flower2,
  Heart,
  Infinity,
  Loader2,
  MousePointer2,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Shuffle,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  exportToGLB,
  exportToOBJ,
  takeScreenshot as takeScreenshotUtil,
} from "./utils/exportHelpers";
import { createFull3DShape } from "./utils/shapeCreation";
import { shapes as shapesDataArray } from "./utils/shapesData";

const animationPresets = {
  gentle: {
    name: "Gentle flow",
    description: "Soft continuous movement",
    rotationSpeed: [0.002, 0.004, 0.001],
    floatAmplitude: 0.03,
    floatSpeed: 0.0003,
    icon: Sparkles,
  },
  energetic: {
    name: "Energetic pulse",
    description: "Brighter, quicker motion",
    rotationSpeed: [0.008, 0.012, 0.004],
    floatAmplitude: 0.08,
    floatSpeed: 0.001,
    icon: Zap,
  },
  dramatic: {
    name: "Dramatic sweep",
    description: "Cinematic rotation",
    rotationSpeed: [0.01, 0.005, 0.015],
    floatAmplitude: 0.12,
    floatSpeed: 0.0008,
    icon: Box,
  },
  bounce: {
    name: "Soft bounce",
    description: "Playful vertical motion",
    rotationSpeed: [0.003, 0.006, 0.002],
    floatAmplitude: 0.15,
    floatSpeed: 0.002,
    icon: Play,
  },
  spin: {
    name: "Clean spin",
    description: "Fast balanced rotation",
    rotationSpeed: [0.02, 0.02, 0.02],
    floatAmplitude: 0.02,
    floatSpeed: 0.0005,
    icon: RotateCcw,
  },
};

const getShapeIcon = (shapeId) => {
  const iconMap = {
    heart: Heart,
    star: Star,
    diamond: Diamond,
    flower: Flower2,
    crown: Crown,
    infinity: Infinity,
    spiral: Zap,
  };

  return iconMap[shapeId] || Box;
};

const createRandomHexColor = () => {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  return `#${color.padStart(6, "0")}`;
};

const PanelShell = ({ children, className = "" }) => {
  return (
    <Card
      className={`overflow-hidden rounded-3xl border-stone-200/80 bg-white/82 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] ${className}`}
    >
      {children}
    </Card>
  );
};

const SectionEyebrow = ({ children }) => {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800 dark:text-amber-400">
      {children}
    </span>
  );
};

const StudioHeader = () => {
  return (
    <header className="mb-6 grid gap-5 lg:mb-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <SectionEyebrow>Browser-based 3D workspace</SectionEyebrow>

        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-stone-950 dark:text-white sm:text-4xl lg:text-5xl">
          Shape, refine, and export polished 3D assets.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-base">
          A calm creative studio for testing forms, materials, motion, and
          exports without the noisy interface patterns common in 3D tools.
        </p>
      </div>

      <div className="grid gap-2 rounded-3xl border border-stone-200 bg-white/70 p-3 text-sm text-stone-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 sm:grid-cols-3 lg:min-w-[460px]">
        {["Live preview", "Material control", "Clean export"].map((item) => (
          <div key={item} className="flex items-center gap-2 px-2 py-1">
            <CheckCircle2 className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </header>
  );
};

const EnhancedShapeSelector = ({ shapes, currentShape, onShapeSelect }) => {
  return (
    <PanelShell>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-stone-950 dark:text-white">
          <Palette className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          Shape library
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-stone-500 dark:text-stone-400">
          Choose the base form for your scene.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {shapes.map((shape) => {
          const Icon = getShapeIcon(shape.id);
          const isActive = currentShape === shape.id;

          return (
            <Button
              key={shape.id}
              variant="ghost"
              className={`h-auto w-full justify-start rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "border-stone-950 bg-stone-950 text-white shadow-sm hover:bg-stone-800 dark:border-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                  : "border-transparent text-stone-700 hover:border-stone-200 hover:bg-stone-100 dark:text-stone-300 dark:hover:border-white/10 dark:hover:bg-white/[0.06]"
              }`}
              onClick={() => onShapeSelect(shape.id)}
            >
              <span
                className={`mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  isActive
                    ? "bg-white/12 text-white dark:bg-stone-950/10 dark:text-stone-950"
                    : "bg-[#f3eadc] text-stone-800 dark:bg-white/[0.06] dark:text-stone-200"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  {shape.name}
                </span>

                {shape.category && (
                  <span
                    className={`mt-0.5 block text-xs ${
                      isActive
                        ? "text-white/68 dark:text-stone-700"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {shape.category}
                  </span>
                )}
              </span>

              {isActive && (
                <span className="ml-3 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 dark:bg-stone-950/10 dark:text-stone-700">
                  Active
                </span>
              )}
            </Button>
          );
        })}
      </CardContent>
    </PanelShell>
  );
};

const EnhancedAnimationControls = ({
  isAnimating,
  onToggleAnimation,
  onResetAnimation,
  animationPreset,
  onAnimationPresetChange,
}) => {
  return (
    <PanelShell>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-stone-950 dark:text-white">
          <Play className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          Motion
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-stone-500 dark:text-stone-400">
          Preview movement without overpowering the scene.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button
            onClick={onToggleAnimation}
            className="h-11 rounded-2xl bg-stone-950 text-sm font-semibold text-white hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
          >
            {isAnimating ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause motion
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play motion
              </>
            )}
          </Button>

          <Button
            onClick={onResetAnimation}
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-2xl border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200 dark:hover:bg-white/[0.08]"
            aria-label="Reset animation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Motion style
          </Label>

          <Select
            value={animationPreset}
            onValueChange={onAnimationPresetChange}
          >
            <SelectTrigger className="h-12 rounded-2xl border-stone-200 bg-[#fbfaf7] text-stone-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border-stone-200 bg-white text-stone-950 dark:border-white/10 dark:bg-stone-900 dark:text-white">
              {Object.entries(animationPresets).map(([key, preset]) => {
                const Icon = preset.icon;

                return (
                  <SelectItem key={key} value={key} className="rounded-xl">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </PanelShell>
  );
};

const EnhancedExportControls = ({
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
  isExporting,
  exportProgress,
}) => {
  return (
    <PanelShell>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-stone-950 dark:text-white">
          <Download className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          Export
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-stone-500 dark:text-stone-400">
          Save your current asset or capture the scene.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {isExporting && (
          <div className="rounded-2xl border border-stone-200 bg-[#fbfaf7] p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-2 flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting {exportProgress}%
            </div>
            <Progress
              value={exportProgress}
              className="h-2 bg-stone-200 dark:bg-white/10"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Button
            onClick={onExportGLB}
            disabled={isExporting}
            variant="outline"
            className="h-11 justify-start rounded-2xl border-stone-200 bg-white text-stone-800 hover:bg-stone-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200 dark:hover:bg-white/[0.08]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export GLB
          </Button>

          <Button
            onClick={onExportOBJ}
            disabled={isExporting}
            variant="outline"
            className="h-11 justify-start rounded-2xl border-stone-200 bg-white text-stone-800 hover:bg-stone-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200 dark:hover:bg-white/[0.08]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export OBJ
          </Button>

          <Button
            onClick={onTakeScreenshot}
            disabled={isExporting}
            variant="outline"
            className="h-11 justify-start rounded-2xl border-stone-200 bg-white text-stone-800 hover:bg-stone-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200 dark:hover:bg-white/[0.08]"
          >
            <Camera className="mr-2 h-4 w-4" />
            Screenshot
          </Button>
        </div>
      </CardContent>
    </PanelShell>
  );
};

const EnhancedSettingsPanel = ({
  settings,
  onSettingsChange,
  show,
  onClose,
}) => {
  const updateSetting = (key, value) => {
    onSettingsChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl border-stone-200 bg-[#fbfaf7] text-stone-950 shadow-2xl dark:border-white/10 dark:bg-stone-950 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-[-0.035em]">
            Scene settings
          </DialogTitle>
          <DialogDescription className="text-stone-600 dark:text-stone-400">
            Fine-tune the material, motion, and rendering behavior.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="material" className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-2xl bg-stone-200/70 p-1 dark:bg-white/[0.06]">
            <TabsTrigger value="material" className="rounded-xl">
              Material
            </TabsTrigger>
            <TabsTrigger value="animation" className="rounded-xl">
              Motion
            </TabsTrigger>
            <TabsTrigger value="rendering" className="rounded-xl">
              Rendering
            </TabsTrigger>
          </TabsList>

          <TabsContent value="material" className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Material type</Label>
              <Select
                value={settings.materialType}
                onValueChange={(value) => updateSetting("materialType", value)}
              >
                <SelectTrigger className="h-12 rounded-2xl border-stone-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-stone-200 bg-white dark:border-white/10 dark:bg-stone-900">
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="metallic">Metallic</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="crystal">Crystal</SelectItem>
                  <SelectItem value="ceramic">Ceramic</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Shape color</Label>
              <input
                type="color"
                value={settings.shapeColor}
                onChange={(event) =>
                  updateSetting("shapeColor", event.target.value)
                }
                className="h-12 w-full cursor-pointer rounded-2xl border border-stone-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Extrude depth: {settings.extrudeDepth}
              </Label>
              <Slider
                value={[settings.extrudeDepth]}
                onValueChange={([value]) =>
                  updateSetting("extrudeDepth", value)
                }
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="animation" className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Animation speed: {settings.animationSpeed}x
              </Label>
              <Slider
                value={[settings.animationSpeed]}
                onValueChange={([value]) =>
                  updateSetting("animationSpeed", value)
                }
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="rendering" className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Light intensity: {settings.lightIntensity}
              </Label>
              <Slider
                value={[settings.lightIntensity]}
                onValueChange={([value]) =>
                  updateSetting("lightIntensity", value)
                }
                max={2}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Quality</Label>
              <Select
                value={settings.quality}
                onValueChange={(value) => updateSetting("quality", value)}
              >
                <SelectTrigger className="h-12 rounded-2xl border-stone-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-stone-200 bg-white dark:border-white/10 dark:bg-stone-900">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const ViewerPanel = ({ mountRef, isExporting, exportProgress }) => {
  return (
    <div className="lg:col-span-3">
      <div className="overflow-hidden rounded-[2rem] border border-stone-300 bg-stone-950 p-2 shadow-[0_32px_90px_rgba(28,25,23,0.2)] dark:border-white/10">
        <div className="overflow-hidden rounded-[1.55rem] bg-[#f8f4ec] dark:bg-stone-900">
          <div className="flex items-center gap-3 border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
            </div>

            <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Scene preview
            </span>

            <div className="ml-auto hidden items-center gap-2 rounded-full border border-emerald-700/15 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-300" />
              Live
            </div>
          </div>

          <div className="group relative min-h-[520px] overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.10),transparent_34%),linear-gradient(135deg,#faf8f3,#e8dfd0)] dark:bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(135deg,#11100e,#292524)] sm:min-h-[620px] lg:min-h-[760px]">
            <div ref={mountRef} className="absolute inset-0 h-full w-full" />

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/58 p-4 text-sm text-stone-700 opacity-0 shadow-sm backdrop-blur-xl transition-all duration-500 group-hover:opacity-100 dark:border-white/10 dark:bg-black/30 dark:text-stone-300 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 font-medium">
                <MousePointer2 className="h-4 w-4" />
                Drag to orbit. Scroll to zoom.
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Real-time Three.js scene
              </span>
            </div>

            {isExporting && (
              <div className="absolute inset-x-4 top-4 rounded-3xl border border-stone-200 bg-white/82 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing export {exportProgress}%
                </div>
                <Progress
                  value={exportProgress}
                  className="h-2 bg-stone-200 dark:bg-white/10"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewCanvas = ({ mountRef, isExporting, exportProgress }) => {
  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.10),transparent_32%),linear-gradient(135deg,#faf8f3,#e8dfd0)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.14),transparent_32%),linear-gradient(135deg,#11100e,#292524)]">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-stone-200 bg-white/65 px-3 py-1 text-xs font-medium text-stone-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/30 dark:text-stone-300">
        Interactive 3D preview
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-stone-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/30 dark:text-stone-300">
        <span className="flex items-center gap-2 font-medium">
          <MousePointer2 className="h-4 w-4" />
          Drag to orbit
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          Live scene
        </span>
      </div>

      {isExporting && (
        <div className="absolute inset-x-4 top-14 rounded-2xl border border-stone-200 bg-white/82 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-200">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Preparing export {exportProgress}%
          </div>
          <Progress
            value={exportProgress}
            className="h-1.5 bg-stone-200 dark:bg-white/10"
          />
        </div>
      )}
    </div>
  );
};

const QuickActions = ({ onRandomize, onOpenSettings }) => {
  return (
    <PanelShell>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-stone-950 dark:text-white">
          <SettingsIcon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          Scene tools
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-stone-500 dark:text-stone-400">
          Explore a direction or open deeper controls.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2">
        <Button
          onClick={onRandomize}
          variant="outline"
          className="h-11 justify-start rounded-2xl border-stone-200 bg-white text-stone-800 hover:bg-stone-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200 dark:hover:bg-white/[0.08]"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Randomize scene
        </Button>

        <Button
          onClick={onOpenSettings}
          className="h-11 justify-start rounded-2xl bg-stone-950 text-sm font-semibold text-white hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Advanced settings
        </Button>
      </CardContent>
    </PanelShell>
  );
};

const StudioNotes = () => {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
        {
          title: "Orbit controls",
          text: "Drag inside the preview to rotate around the object and inspect the scene.",
        },
        {
          title: "Material testing",
          text: "Use the settings panel to test finish, color, depth, lighting, and quality.",
        },
        {
          title: "Export workflow",
          text: "Download GLB, OBJ, or a screenshot when the composition is ready.",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.035]"
        >
          <h3 className="text-sm font-semibold text-stone-950 dark:text-white">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};

const Enhanced3DShapes = ({ isPlaying, demoMode = false }) => {
  const isHeroPreview = typeof isPlaying === "boolean" && !demoMode;

  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const animationIdRef = useRef(null);
  const currentMeshRef = useRef(null);
  const lightsRef = useRef({});
  const skyboxGradRef = useRef(null);
  const envMapTextureRef = useRef(null);

  const [currentShapeId, setCurrentShapeId] = useState(
    shapesDataArray[0]?.id || "heart",
  );

  const [isAnimatingState, setIsAnimatingState] = useState(
    typeof isPlaying === "boolean" ? isPlaying : true,
  );

  const [animationPreset, setAnimationPreset] = useState("gentle");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    materialType: "auto",
    animationSpeed: 1.0,
    lightIntensity: 1.0,
    extrudeDepth: 0.3,
    quality: "high",
    shapeColor: "#d97706",
  });

  const isAnimatingLoopRef = useRef(isAnimatingState);
  const settingsLoopRef = useRef(settings);
  const animationPresetLoopRef = useRef(animationPreset);
  const currentShapeIdRef = useRef(currentShapeId);

  const animationState = useRef({
    startTime: Date.now(),
    accumulatedPauseTime: 0,
    lastPauseTime: 0,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof isPlaying === "boolean") {
      setIsAnimatingState(isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    isAnimatingLoopRef.current = isAnimatingState;
  }, [isAnimatingState]);

  useEffect(() => {
    settingsLoopRef.current = settings;
  }, [settings]);

  useEffect(() => {
    animationPresetLoopRef.current = animationPreset;
  }, [animationPreset]);

  useEffect(() => {
    currentShapeIdRef.current = currentShapeId;
  }, [currentShapeId]);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const gradientGeometry = new THREE.SphereGeometry(50, 32, 32);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0xf6f1e8) },
        bottomColor: { value: new THREE.Color(0x2a2520) },
        offset: { value: 33 },
        exponent: { value: 0.7 },
      },
      vertexShader:
        "varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }",
      side: THREE.BackSide,
    });

    const skybox = new THREE.Mesh(gradientGeometry, gradientMaterial);
    scene.add(skybox);
    skyboxGradRef.current = skybox;
    scene.fog = new THREE.Fog(0x2a2520, 8, 30);

    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 0.5, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      "/brown_photostudio_02_4k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (sceneRef.current) sceneRef.current.environment = texture;
        envMapTextureRef.current = texture;
      },
      undefined,
      (error) => console.error("HDR Load Error:", error),
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4dc, 0.78);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb6fff2, 0.28);
    rimLight.position.set(-6, 3, -7);
    scene.add(rimLight);

    lightsRef.current = {
      ambient: ambientLight,
      key: keyLight,
      rim: rimLight,
    };

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, camera));

    const ssaoPass = new SSAOPass(
      scene,
      camera,
      currentMount.clientWidth,
      currentMount.clientHeight,
    );

    ssaoPass.kernelRadius = 0.6;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.05;

    composer.addPass(ssaoPass);
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (controlsRef.current) controlsRef.current.update();

      if (isAnimatingLoopRef.current && currentMeshRef.current) {
        const localSettings = settingsLoopRef.current;
        const preset = animationPresets[animationPresetLoopRef.current];
        const speed = localSettings.animationSpeed;

        currentMeshRef.current.rotation.x +=
          preset.rotationSpeed[0] * 60 * delta * speed;
        currentMeshRef.current.rotation.y +=
          preset.rotationSpeed[1] * 60 * delta * speed;
        currentMeshRef.current.rotation.z +=
          preset.rotationSpeed[2] * 60 * delta * speed;

        const currentTime = Date.now();
        const elapsedTimeSinceStart =
          (currentTime -
            animationState.current.startTime -
            (animationState.current.accumulatedPauseTime || 0)) *
          0.001;

        const floatTime = elapsedTimeSinceStart * speed;

        currentMeshRef.current.position.y =
          Math.sin(floatTime * preset.floatSpeed * 100) * preset.floatAmplitude;
      }

      if (composerRef.current) composerRef.current.render(delta);
      else if (rendererRef.current) rendererRef.current.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (currentMount && cameraRef.current && rendererRef.current) {
        const width = currentMount.clientWidth || 1;
        const height = currentMount.clientHeight || 1;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(width, height);

        if (composerRef.current) composerRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);

      window.removeEventListener("resize", handleResize);

      controlsRef.current?.dispose();
      envMapTextureRef.current?.dispose();

      if (skyboxGradRef.current) {
        skyboxGradRef.current.geometry?.dispose();
        skyboxGradRef.current.material?.dispose();
        sceneRef.current?.remove(skyboxGradRef.current);
      }

      if (currentMeshRef.current) {
        currentMeshRef.current.geometry?.dispose();

        if (Array.isArray(currentMeshRef.current.material)) {
          currentMeshRef.current.material.forEach((material) =>
            material.dispose(),
          );
        } else {
          currentMeshRef.current.material?.dispose();
        }

        sceneRef.current?.remove(currentMeshRef.current);
      }

      composerRef.current?.passes.forEach((pass) => pass.dispose?.());

      if (
        rendererRef.current &&
        currentMount &&
        rendererRef.current.domElement
      ) {
        currentMount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      } else if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      sceneRef.current?.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose?.();
          }
        }
      });

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      currentMeshRef.current = null;
      skyboxGradRef.current = null;
      envMapTextureRef.current = null;
      lightsRef.current = {};
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !sceneRef.current || !settingsLoopRef.current) return;

    if (currentMeshRef.current) {
      sceneRef.current.remove(currentMeshRef.current);
      currentMeshRef.current.geometry?.dispose();

      if (Array.isArray(currentMeshRef.current.material)) {
        currentMeshRef.current.material.forEach((material) =>
          material.dispose(),
        );
      } else {
        currentMeshRef.current.material?.dispose();
      }
    }

    const newMesh = createFull3DShape(
      currentShapeId,
      settingsLoopRef.current,
      1.5,
    );

    sceneRef.current.add(newMesh);
    currentMeshRef.current = newMesh;

    animationState.current.startTime = Date.now();
    animationState.current.accumulatedPauseTime = 0;

    if (currentMeshRef.current) currentMeshRef.current.position.y = 0;
  }, [currentShapeId, isMounted]);

  useEffect(() => {
    if (
      !isMounted ||
      !currentMeshRef.current ||
      !sceneRef.current ||
      !settingsLoopRef.current
    ) {
      return;
    }

    const currentSettings = settingsLoopRef.current;
    const mesh = currentMeshRef.current;

    const newMaterialType =
      currentSettings.materialType === "auto"
        ? shapesDataArray.find(
            (shape) => shape.id === currentShapeIdRef.current,
          )?.autoMaterial || "ceramic"
        : currentSettings.materialType;

    let materialChanged = false;

    if (
      mesh.material.userData?.type !== newMaterialType ||
      mesh.material.color.getHexString() !==
        currentSettings.shapeColor.substring(1)
    ) {
      materialChanged = true;
    }

    if (materialChanged) {
      const tempMeshForMaterial = createFull3DShape(
        currentShapeIdRef.current,
        currentSettings,
        1.5,
      );

      mesh.material.dispose();
      mesh.material = tempMeshForMaterial.material.clone();
      mesh.material.needsUpdate = true;
      tempMeshForMaterial.geometry.dispose();
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (!isMounted || !lightsRef.current.ambient) return;

    const intensity = settingsLoopRef.current.lightIntensity;

    lightsRef.current.ambient.intensity = 0.28 * intensity;

    if (lightsRef.current.key) {
      lightsRef.current.key.intensity = 0.78 * intensity;
    }

    if (lightsRef.current.rim) {
      lightsRef.current.rim.intensity = 0.28 * intensity;
    }
  }, [settings.lightIntensity, isMounted]);

  const handleToggleAnimation = useCallback(() => {
    setIsAnimatingState((prevIsAnimating) => {
      const newIsAnimating = !prevIsAnimating;

      if (newIsAnimating) {
        const pauseDuration =
          Date.now() - (animationState.current.lastPauseTime || Date.now());

        animationState.current.accumulatedPauseTime =
          (animationState.current.accumulatedPauseTime || 0) + pauseDuration;
      } else {
        animationState.current.lastPauseTime = Date.now();
      }

      return newIsAnimating;
    });
  }, []);

  const handleResetAnimation = useCallback(() => {
    if (currentMeshRef.current) {
      currentMeshRef.current.rotation.set(0, 0, 0);
      currentMeshRef.current.position.set(0, 0, 0);
    }

    animationState.current.startTime = Date.now();
    animationState.current.accumulatedPauseTime = 0;
    animationState.current.lastPauseTime = 0;

    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.2, 0);
    }
  }, []);

  useEffect(() => {
    if (isMounted) handleResetAnimation();
  }, [animationPreset, isMounted, handleResetAnimation]);

  const handleRandomize = useCallback(() => {
    const randomShape =
      shapesDataArray[Math.floor(Math.random() * shapesDataArray.length)];

    const randomPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];

    const materialKeys = [
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
    ];

    const randomMaterial =
      materialKeys[Math.floor(Math.random() * materialKeys.length)];

    setCurrentShapeId(randomShape.id);
    setAnimationPreset(randomPresetKey);

    setSettings((prev) => ({
      ...prev,
      materialType: randomMaterial,
      shapeColor: createRandomHexColor(),
      extrudeDepth: parseFloat((Math.random() * (0.8 - 0.1) + 0.1).toFixed(2)),
      lightIntensity: parseFloat(
        (Math.random() * (1.5 - 0.5) + 0.5).toFixed(1),
      ),
      animationSpeed: parseFloat(
        (Math.random() * (2.0 - 0.5) + 0.5).toFixed(1),
      ),
    }));
  }, []);

  const handleExportGLBCallback = useCallback(async () => {
    if (!currentMeshRef.current || isExporting) {
      console.warn("Export GLB: Not ready.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const result = await exportToGLB(
        currentMeshRef.current,
        currentShapeIdRef.current,
        setExportProgress,
      );

      if (result && result.glbBuffer) {
        const blob = new Blob([result.glbBuffer], {
          type: "model/gltf-binary",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = result.filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } else if (!result) {
        console.error("GLB Export failed, result was null.");
      }
    } catch (error) {
      console.error("Error during GLB export process:", error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  }, [isExporting]);

  const handleExportOBJCallback = useCallback(() => {
    if (!currentMeshRef.current || isExporting) {
      console.warn("Export OBJ: Not ready.");
      return;
    }

    setIsExporting(true);

    const result = exportToOBJ(
      currentMeshRef.current,
      currentShapeIdRef.current,
    );

    if (result && result.objContent) {
      const blob = new Blob([result.objContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = result.filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } else if (!result) {
      console.error("OBJ Export failed, result was null.");
    }

    setIsExporting(false);
  }, [isExporting]);

  const handleTakeScreenshotCallback = useCallback(() => {
    if (!rendererRef.current) return;

    if (composerRef.current) {
      composerRef.current.render();
    } else if (sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    } else {
      console.warn("Cannot take screenshot, rendering components not ready.");
      return;
    }

    const result = takeScreenshotUtil(
      rendererRef.current,
      currentShapeIdRef.current,
    );

    if (result && result.dataURL) {
      const link = document.createElement("a");

      link.download = result.filename;
      link.href = result.dataURL;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (!result) {
      console.error("Screenshot failed, result was null.");
    }
  }, []);

  if (!isMounted) {
    if (isHeroPreview) {
      return (
        <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-[#f8f4ec] dark:bg-stone-900">
          <Loader2 className="h-6 w-6 animate-spin text-amber-700 dark:text-amber-400" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f6f1e8] px-4 py-16 text-stone-950 dark:bg-stone-950 dark:text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="max-w-xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <Loader2 className="h-6 w-6 animate-spin text-amber-700 dark:text-amber-400" />
            </div>

            <SectionEyebrow>Loading workspace</SectionEyebrow>

            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Preparing your 3D studio.
            </h1>

            <p className="mt-4 text-sm leading-7 text-stone-600 dark:text-stone-400">
              Initializing the scene, controls, renderer, and export tools.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isHeroPreview) {
    return (
      <PreviewCanvas
        mountRef={mountRef}
        isExporting={isExporting}
        exportProgress={Math.round(exportProgress)}
      />
    );
  }

  return (
    <div className="min-h-screen select-none bg-[#f6f1e8] text-stone-950 dark:bg-stone-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(180,83,9,0.15),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(15,118,110,0.12),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.58),transparent_44%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(245,158,11,0.13),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(20,184,166,0.08),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_44%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,25,23,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.045)_1px,transparent_1px)] bg-[size:76px_76px] opacity-40 [mask-image:radial-gradient(ellipse_74%_58%_at_50%_36%,#000_48%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
      </div>

      <main className="mx-auto max-w-[1500px] px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
        {!demoMode && <StudioHeader />}

        <div className="grid gap-4 lg:grid-cols-4 lg:gap-5">
          <aside className="space-y-4 lg:col-span-1">
            <EnhancedShapeSelector
              shapes={shapesDataArray}
              currentShape={currentShapeId}
              onShapeSelect={setCurrentShapeId}
            />

            <EnhancedAnimationControls
              isAnimating={isAnimatingState}
              onToggleAnimation={handleToggleAnimation}
              onResetAnimation={handleResetAnimation}
              animationPreset={animationPreset}
              onAnimationPresetChange={setAnimationPreset}
            />

            <EnhancedExportControls
              onExportGLB={handleExportGLBCallback}
              onExportOBJ={handleExportOBJCallback}
              onTakeScreenshot={handleTakeScreenshotCallback}
              isExporting={isExporting}
              exportProgress={Math.round(exportProgress)}
            />

            <QuickActions
              onRandomize={handleRandomize}
              onOpenSettings={() => setShowSettings(true)}
            />
          </aside>

          <ViewerPanel
            mountRef={mountRef}
            isExporting={isExporting}
            exportProgress={Math.round(exportProgress)}
          />
        </div>

        {!demoMode && (
          <>
            <StudioNotes />

            <footer className="mt-8 flex flex-col gap-2 border-t border-stone-200/80 pt-6 text-xs text-stone-500 dark:border-white/10 dark:text-stone-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} 3D Shapes Studio.</p>
              <p>Built with React and Three.js.</p>
            </footer>
          </>
        )}
      </main>

      <EnhancedSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        show={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default Enhanced3DShapes;
