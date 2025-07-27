import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

const ForceRefreshButton = ({
  onRefresh,
  className,
  title = "Force Refresh Canvas",
  ...props
}) => {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={onRefresh}
      title={title}
      className={cn(
        "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:border-slate-500",
        "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900", // Enhanced focus
        className
      )}
      {...props}
    >
      <RefreshCw className='h-4 w-4 mr-2 opacity-80' />
      {props.children || "Refresh Canvas"}
    </Button>
  );
};

export default ForceRefreshButton;
