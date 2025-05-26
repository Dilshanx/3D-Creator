import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UploadCloud,
  ImageIcon,
  XCircle,
  Download,
  Camera,
} from "lucide-react";

export const FileTextureControls = ({
  isExporting,
  exportProgress,
  appliedTexture,
  onTriggerModelImport,
  onTriggerImageImport,
  onRemoveAppliedTexture,
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
}) => (
  <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
    <CardHeader>
      <CardTitle className='text-slate-100 text-lg'>File & Textures</CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <Button
        onClick={onTriggerModelImport}
        disabled={isExporting}
        className='w-full bg-green-600 hover:bg-green-700'
      >
        <UploadCloud size={16} className='mr-2' /> Import Model
      </Button>
      <Button
        onClick={onTriggerImageImport}
        variant='outline'
        className='w-full border-sky-500 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300'
      >
        <ImageIcon size={16} className='mr-2' /> Apply Texture
      </Button>
      {appliedTexture && (
        <Button
          onClick={onRemoveAppliedTexture}
          variant='outline'
          className='w-full border-amber-500 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300'
        >
          <XCircle size={16} className='mr-2' /> Remove Texture
        </Button>
      )}
      <Separator className='my-3 bg-slate-700' />
      <Button
        onClick={onExportGLB}
        disabled={isExporting}
        className='w-full bg-blue-600 hover:bg-blue-700'
      >
        <Download size={16} className='mr-2' />
        {isExporting && exportProgress > 0 && exportProgress <= 100
          ? `GLB... ${Math.round(exportProgress)}%`
          : "Export GLB"}
      </Button>
      <Button
        onClick={onExportOBJ}
        disabled={isExporting}
        className='w-full bg-teal-600 hover:bg-teal-700'
      >
        <Download size={16} className='mr-2' />
        {isExporting && exportProgress > 0 && exportProgress <= 100
          ? `OBJ... ${Math.round(exportProgress)}%`
          : "Export OBJ (Sim.)"}
      </Button>
      <Button
        onClick={onTakeScreenshot}
        disabled={isExporting}
        className='w-full bg-purple-600 hover:bg-purple-700'
      >
        <Camera size={16} className='mr-2' /> Screenshot
      </Button>
    </CardContent>
  </Card>
);
