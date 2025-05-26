import React from "react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export const SettingsButton = ({ onClick }) => (
  <Button
    variant='outline'
    className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 py-3'
    onClick={onClick}
  >
    <SettingsIcon size={16} className='mr-2' /> Viewer Settings
  </Button>
);
