import { ReactNode } from "react";
import { cn } from "@/utils/helpers"; // Assuming this is your path

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 ",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2 ",
  left: "right-[-4px] top-1/2 -translate-y-1/2 ",
  right: "left-[-4px] top-1/2 -translate-y-1/2 ",
};

const Tooltip = ({ 
  children, 
  content, 
  position = "top", 
  className 
}: TooltipProps) => {
  return (
    <div className="group relative flex items-center justify-center w-max">
      {/* The Trigger Element */}
      {children}

      {/* The Tooltip Body */}
      <div
        className={cn(
          // Layout & Visibility
          "absolute pointer-events-none invisible opacity-0 scale-95",
          "group-hover:visible group-hover:opacity-100 group-hover:scale-100",
          "transition-all duration-200 ease-in-out z-50",
          
          // Positioning
          positionClasses[position],
          
          // Styling (Dark background for contrast)
          "bg-secondary text-secondary-content text-xs px-2.5 py-1.5 rounded-md",
          "whitespace-nowrap shadow-lg",
          className
        )}
      >
        {content}

        {/* The Arrow/Triangle */}
        <div
          className={cn(
            "absolute w-2 h-2 bg-secondary rotate-45",
            arrowClasses[position]
          )}
        />
      </div>
    </div>
  );
};

export {Tooltip}