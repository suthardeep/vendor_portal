import { cn } from "@/utils/helpers";
import React from "react";
import Icon from "./Icon";

import type { IconName } from "./Icon";

export interface StatCardProps {
  title: string;
  value: string | number;
  iconName?: IconName;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string | number;
    label?: string;
    isPositive?: boolean;
  };
  subtitle?: string;
  className?: string;
  iconSize?: number;
  valueClassName?: string;
  titleClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  iconColor = "text-primary-600",
  iconBgColor = "bg-primary-100",
  trend,
  subtitle,
  className,
  iconSize = 24,
  valueClassName,
  titleClassName,
}) => {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      {iconName && (
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
            iconBgColor
          )}
        >
          <Icon name={iconName} size={iconSize} className={iconColor} />
        </div>
      )}
      
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm text-body-content", titleClassName)}>
          {title}
        </p>
        <p className={cn("text-3xl font-bold text-base-content", valueClassName)}>
          {value}
        </p>
        
        {(trend || subtitle) && (
          <div className="flex items-center gap-2">
            {trend && (
              <>
                <Icon
                  name="TrendingUp"
                  size={16}
                  className={cn(
                    trend.isPositive !== false ? "text-success" : "text-error"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive !== false ? "text-success" : "text-error"
                  )}
                >
                  {trend.value}
                </span>
                {trend.label && (
                  <span className="text-sm text-disabled-content">
                    {trend.label}
                  </span>
                )}
              </>
            )}
            {subtitle && !trend && (
              <span className="text-sm text-disabled-content">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.displayName = "StatCard";

export { StatCard };