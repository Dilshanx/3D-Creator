import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ExportingDialog = ({ exportProgress }) => (
  <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
    <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
      <CardHeader className='p-0 mb-4'>
        <CardTitle className='text-xl sm:text-2xl'>Exporting Model</CardTitle>
      </CardHeader>
      <CardContent className='p-0 space-y-3'>
        <div className='text-lg font-semibold'>
          {Math.round(exportProgress)}%
        </div>
        <Progress value={exportProgress} className='w-full h-2.5' />
        <p className='text-xs text-slate-500'>
          Please wait, this may take a moment...
        </p>
      </CardContent>
    </Card>
  </div>
);
