import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";
import Icon from "./Icon";

const cardVariants = cva(
  "w-full max-w-full rounded-lg p-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-base-1 border border-base-3",
        elevated: "bg-base-1 shadow-lg",
        ghost: "bg-base-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-lg transition-all duration-200",
  {
    variants: {
      size: {
        sm: "size-10",
        md: "size-12",
        lg: "size-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const percentageVariants = cva(
  "inline-flex items-center gap-1 text-sm font-semibold",
  {
    variants: {
      trend: {
        increase: "text-success",
        decrease: "text-error",
        neutral: "text-body-content",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
);

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  percentage?: number;
  trend?: "increase" | "decrease" | "neutral";
  iconName?: string;
  iconBgColor?: string;
  iconColor?: string;
  iconSize?: "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "ghost";
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  subtitleClassName?: string;
  percentageClassName?: string;
  showTrendIcon?: boolean;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      value,
      subtitle,
      percentage,
      trend = "neutral",
      iconName,
      iconBgColor = "bg-error",
      iconColor = "text-base-1",
      iconSize = "md",
      variant = "default",
      className,
      iconClassName,
      titleClassName,
      valueClassName,
      subtitleClassName,
      percentageClassName,
      showTrendIcon = true,
    },
    ref
  ) => {
    const getTrendIconName = () => {
      if (!showTrendIcon) return null;
      
      switch (trend) {
        case "increase":
          return "TrendingUp";
        case "decrease":
          return "TrendingDown";
        case "neutral":
          return "Minus";
        default:
          return null;
      }
    };

    const trendIconName = getTrendIconName();

    return (
      <div ref={ref} className={cn(cardVariants({ variant }), className)}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {iconName && (
              <div
                className={cn(
                  iconContainerVariants({ size: iconSize }),
                  iconBgColor,
                  iconClassName
                )}
              >
                <Icon 
                  name={iconName} 
                  size={iconSize === "sm" ? 18 : iconSize === "md" ? 20 : 24}
                  className={iconColor}
                />
              </div>
            )}
            <h3
              className={cn(
                "text-base sm:text-lg font-medium text-base-content",
                titleClassName
              )}
            >
              {title}
            </h3>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-3">
              <p
                className={cn(
                  "text-xl sm:text-2xl font-semibold text-base-content",
                  valueClassName
                )}
              >
                {value}
              </p>

              {percentage !== undefined && (
                <div className={cn(percentageVariants({ trend }), percentageClassName)}>
                  {trendIconName && (
                    <Icon 
                      name={trendIconName} 
                      size={16}
                    />
                  )}
                  <span>{Math.abs(percentage)}%</span>
                </div>
              )}
            </div>

            {subtitle && (
              <p
                className={cn(
                  "text-sm text-body-content",
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };