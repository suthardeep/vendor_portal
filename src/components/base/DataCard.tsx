import { cn } from "@/utils/helpers";
import React, { forwardRef } from "react";

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  bordered?: boolean;
}

const DataCard = forwardRef<HTMLDivElement, DataCardProps>(
  (
    {
      children,
      className,
      padding = "md",
      shadow = "sm",
      bordered = false,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const shadowClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-base-1 rounded-xl",
          paddingClasses[padding],
          shadowClasses[shadow],
          bordered && "border border-base-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DataCard.displayName = "DataCard";

export { DataCard };