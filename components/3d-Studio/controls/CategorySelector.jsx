import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming your cn utility is in lib/utils.js

export const CategorySelector = ({
  categories,
  currentCategory,
  onCategorySelect,
}) => (
  <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
    <CardHeader>
      <CardTitle className='text-slate-100 text-lg'>Categories</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='grid grid-cols-2 gap-3'>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            className={cn(
              "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
              currentCategory === category.id
                ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
                : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className='text-2xl sm:text-3xl'>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);
