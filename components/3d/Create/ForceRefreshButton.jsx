// components/ui/ForceRefreshButton.jsx
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming this path
import { RefreshCw } from "lucide-react"; // Or your preferred refresh icon

const ForceRefreshButton = ({ onRefresh, className, ...props }) => {
  return (
    <Button
      variant='outline'
      size='sm' // Or your preferred size
      onClick={onRefresh}
      title='Force Refresh Canvas'
      className={className}
      {...props}
    >
      <RefreshCw className='h-4 w-4 mr-2' />
      Refresh Canvas
    </Button>
  );
};

export default ForceRefreshButton;
