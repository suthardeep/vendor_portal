import React from "react";
import { cn } from "@/utils/helpers";
import { Button } from "../base/Button";
import { ActionButton, ClassNameConfig } from "./table.types";

interface TableFooterProps {
  actions?: ActionButton[];
  classNameConfig?: ClassNameConfig["tableFooter"];
}

export const TableFooter: React.FC<TableFooterProps> = ({
  actions,
  classNameConfig,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div
      className={cn(
        "px-4 py-2 border-t border-base-content/10 bg-base-1",
        classNameConfig?.container
      )}
    >
      <div className="flex w-full justify-end">
        <div className="flex flex-wrap gap-1.5 items-center">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              onClick={action.onClick}
              variant={action.variant}
              color="primary"
              size="xs"
              startIcon={
                typeof action.icon === "string"
                  ? undefined
                  : action.icon
              }
              className={cn(
                "whitespace-nowrap text-[11px] h-7 px-2.5 shrink-0",
                action.variant === "outline" && "border border-base-content/20",
                classNameConfig?.action
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
