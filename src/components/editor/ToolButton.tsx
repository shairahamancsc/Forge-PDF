"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function ToolButton({ icon, label, shortcut, onClick, isActive = false }: ToolButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className={`w-full h-14 flex flex-col items-center justify-center group transition-colors duration-150
                        ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/80 hover:text-accent-foreground'}`}
            onClick={onClick}
            aria-label={label}
          >
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 mb-0.5" })}
            <span className="text-[10px] font-medium leading-none group-hover:text-accent-foreground">
              {label.length > 7 ? label.substring(0,6) + "..." : label}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          <p className="font-medium">{label}</p>
          {shortcut && <p className="text-xs text-muted-foreground">Shortcut: {shortcut}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
