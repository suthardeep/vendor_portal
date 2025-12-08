import { cn } from "@/utils/helpers";
import React from "react";
import Icon from "./Icon";
import { DataCard } from "./DataCard";

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  legend?: Array<{
    label: string;
    color: string;
    value?: string | number;
  }>;
  className?: string;
  headerClassName?: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  headerAction,
  legend,
  className,
  headerClassName,
  showMenuButton = true,
  onMenuClick,
}) => {
  return (
    <DataCard className={cn("space-y-4", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          headerClassName
        )}
      >
        <h3 className="text-xl font-semibold text-base-content">{title}</h3>
        
        <div className="flex items-center gap-2">
          {headerAction}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="text-disabled-content transition-colors duration-200 hover:text-base-content focus:outline-none"
              aria-label="Menu"
            >
              <Icon name="MoreVertical" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-body-content">{item.label}</span>
              {item.value && (
                <span className="text-sm font-medium text-base-content">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart Content */}
      <div className="w-full">{children}</div>
    </DataCard>
  );
};

ChartCard.displayName = "ChartCard";

export { ChartCard };