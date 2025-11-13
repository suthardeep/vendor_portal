import { cn } from "@/utils/helpers";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delayDuration = 200,
  side = "top",
  align = "center",
  className,
}) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            className={cn(
              "TooltipContent animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs",
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="dark:fill-nd-500 fill-nl-100" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
