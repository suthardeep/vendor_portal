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
              "TooltipContent animate-in fade-in-0 zoom-in-95 dark:bg-base-3 bg-neutral-content text-base-3 dark:text-neutral-content z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs",
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="dark:fill-base-3 fill-neutral-content" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
