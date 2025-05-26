import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ShapeSelector = ({ shapes, currentShape, onShapeSelect }) => (
  <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
    <CardHeader>
      <CardTitle className='text-slate-100 text-lg'>Shapes</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            variant={currentShape === shape.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              currentShape === shape.id
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "text-slate-300 hover:bg-slate-700/50"
            )}
            onClick={() => onShapeSelect(shape.id)}
          >
            <span className='text-xl'>{shape.icon}</span>
            {shape.name}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);
