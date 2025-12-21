import React from "react";
import { cn } from "@/utils/helpers";
import { Button } from "../base/Button";
import { ActionButton } from "./table.types";

interface TableFooterProps {
  actions?: ActionButton[];
  className?: string;
}

export const TableFooter: React.FC<TableFooterProps> = ({
  actions,
  className,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div
      className={cn(
        "px-4 py-2 border-t border-base-content/10 bg-base-1",
        className
      )}
    >
      <div className="flex w-full justify-end">
        <div className="flex flex-wrap gap-1.5 items-center">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              onClick={action.onClick}
              variant={action.variant === "primary" ? "filled" : "outline"}
              color="primary"
              size="xs"
              startIcon={
                typeof action.icon === "string"
                  ? undefined
                  : action.icon
              }
              className={cn(
                "whitespace-nowrap text-[11px] h-7 px-2.5 flex-shrink-0",
                action.variant === "outlined" && "border border-base-content/20"
              )}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
