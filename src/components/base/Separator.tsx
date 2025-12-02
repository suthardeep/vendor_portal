import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/helpers";

const separatorVariants = cva(
  "shrink-0 bg-current text-base-content/20", // base line styling
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full",
      },
      variant: {
        solid: "",
        dashed: "border-t border-dashed bg-transparent",
        dotted: "border-t border-dotted bg-transparent",
        gradient: "bg-gradient-to-r from-transparent via-current to-transparent",
      },
      thickness: {
        xs: "h-px border-t-[1px]",
        sm: "h-[2px] border-t-[2px]",
        md: "h-[3px] border-t-[3px]",
        lg: "h-[4px] border-t-[4px]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "solid",
      thickness: "xs",
    },
    compoundVariants: [
      // vertical thickness handling
      { orientation: "vertical", thickness: "xs", class: "w-px h-full" },
      { orientation: "vertical", thickness: "sm", class: "w-[2px] h-full" },
      { orientation: "vertical", thickness: "md", class: "w-[3px] h-full" },
      { orientation: "vertical", thickness: "lg", class: "w-[4px] h-full" },

      // gradient vertical
      { orientation: "vertical", variant: "gradient", class: "bg-gradient-to-b" },
    ],
  }
);

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  /** Optional color override (Tailwind text-color affects currentColor) */
  color?: string;

  /** Custom length override (width or height depending on orientation) */
  length?: number | string;

  /** Legend text or node inside the separator (horizontal only) */
  legend?: React.ReactNode;

  /** Legend alignment relative to separator line */
  legendPosition?: "left" | "center" | "right";
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation,
      variant,
      thickness,
      color,
      length,
      legend,
      legendPosition = "center",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation !== "vertical";

    const lengthStyle = length
      ? isHorizontal
        ? { width: length, ...style }
        : { height: length, ...style }
      : style;

    // If legend exists, render wrapper structure.
    if (legend && isHorizontal) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn("flex items-center select-none w-full", className)}
          style={lengthStyle}
          {...props}
        >
          {/* LEFT LINE */}
          <div
            className={cn(
              "flex-1",
              separatorVariants({ orientation, variant, thickness }),
              color ? `text-${color}` : ""
            )}
          />

          {/* LEGEND */}
          <span
            className={cn(
              "mx-3 text-sm text-base-content whitespace-nowrap",
              legendPosition === "left" && "order-first mr-3",
              legendPosition === "right" && "order-last ml-3"
            )}
          >
            {legend}
          </span>

          {/* RIGHT LINE */}
          <div
            className={cn(
              "flex-1",
              separatorVariants({ orientation, variant, thickness }),
              color ? `text-${color}` : ""
            )}
          />
        </div>
      );
    }

    // Normal non-legend separator
    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          separatorVariants({ orientation, variant, thickness }),
          color ? `text-${color}` : "",
          className
        )}
        style={lengthStyle}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export {Separator};
