// FilterRenderer.tsx - Auto-adjusting width filters
import React from "react";
import { cn } from "@/utils/helpers";
import {Icon} from "../base/Icon";
import {Dropdown} from "../base/Dropdown";
import { FilterConfig } from "./table.types";

interface FilterRendererProps {
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
  size?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled";
  containerClassName?: string;
}

export const FilterRenderer: React.FC<FilterRendererProps> = ({
  filter,
  value,
  onChange,
  size = "md",
  variant = "outlined",
  containerClassName,
}) => {
  const TEXT_SIZE_MAP = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-sm",
  };

  const sizeClasses = {
    sm: `${TEXT_SIZE_MAP.sm} py-1.5 px-2.5`,
    md: `${TEXT_SIZE_MAP.md} py-2 px-4`,
    lg: `${TEXT_SIZE_MAP.lg} py-2.5 px-4`,
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 20,
  };

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  switch (filter.type) {
    case "dropdown":
      return (
        <Dropdown
          value={value}
          onChange={onChange}
          options={filter.options}
          placeholder={filter.label}
          inputSize={size}
          variant={variant}
          icon={filter.icon}
          containerClassName={containerClassName}
          // clearable={false}
        />
      );

    case "date":
      return (
        <div className={cn("relative inline-block", containerClassName)}>
          <div 
            className={cn(
              "flex items-center gap-4 cursor-pointer rounded-md border-1 transition-all",
              "bg-base-1",
              "border-base-content/40",
              sizeClasses[size]
            )}
            onClick={() => dateInputRef.current?.showPicker()}
          >
            <span className={cn(
              "whitespace-nowrap",
              TEXT_SIZE_MAP[size],
              "text-base-content/50"
            )}>
              {value ? new Date(value).toLocaleDateString() : filter.label}
            </span>
            
            {filter.icon && (
              <Icon
                name={filter.icon}
                size={18}
                className="text-base-content flex-shrink-0"
              />
            )}
          </div>
          
          <input
            ref={dateInputRef}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            min={filter.minDate?.toISOString().split("T")[0]}
            max={filter.maxDate?.toISOString().split("T")[0]}
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          />
        </div>
      );

    case "daterange":
      const startInputRef = React.useRef<HTMLInputElement>(null);
      const endInputRef = React.useRef<HTMLInputElement>(null);
      
      return (
        <div className={cn("flex gap-4", containerClassName)}>
          {/* Start Date */}
          <div className="relative inline-block">
            <div 
              className={cn(
                "flex items-center gap-2 cursor-pointer rounded-md border-1 transition-all",
                "bg-base-1",
                "border-base-content/40",
                sizeClasses[size]
              )}
              onClick={() => startInputRef.current?.showPicker()}
            >
              <span className={cn(
                "whitespace-nowrap",
                TEXT_SIZE_MAP[size],
                "text-base-content/50"
              )}>
                {value?.start ? new Date(value.start).toLocaleDateString() : "Start Date"}
              </span>
              
              {filter.icon && (
                <Icon
                  name={filter.icon}
                  size={iconSizes[size]}
                  className="text-base-content flex-shrink-0"
                />
              )}
            </div>
            
            <input
              ref={startInputRef}
              type="date"
              value={value?.start || ""}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              min={filter.minDate?.toISOString().split("T")[0]}
              max={filter.maxDate?.toISOString().split("T")[0]}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            />
          </div>
          
          <span className="text-base-content/50 self-center">→</span>
          
          {/* End Date */}
          <div className="relative inline-block">
            <div 
              className={cn(
                "flex items-center gap-2 cursor-pointer rounded-md border-1 transition-all",
                "bg-base-1",
                "border-base-content/40",
                sizeClasses[size]
              )}
              onClick={() => endInputRef.current?.showPicker()}
            >
              <span className={cn(
                "whitespace-nowrap",
                TEXT_SIZE_MAP[size],
                "text-base-content/50"
              )}>
                {value?.end ? new Date(value.end).toLocaleDateString() : "End Date"}
              </span>
              
              <Icon
                name="Calendar"
                size={iconSizes[size]}
                className="text-base-content flex-shrink-0"
              />
            </div>
            
            <input
              ref={endInputRef}
              type="date"
              value={value?.end || ""}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              min={filter.minDate?.toISOString().split("T")[0]}
              max={filter.maxDate?.toISOString().split("T")[0]}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            />
          </div>
        </div>
      );

    case "search":
      return (
        <div className={cn("relative inline-block", containerClassName)}>
          <div
            className={cn(
              "flex items-center gap-4 rounded-md border-1 transition-all",
              "bg-base-1",
              "border-base-content/40",
              sizeClasses[size]
            )}
          >
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={filter.placeholder || filter.label}
              className={cn(
                "bg-transparent outline-none placeholder:text-base-content/50 w-32",
                TEXT_SIZE_MAP[size],
                "text-base-content/50"
              )}
              style={{ width: value ? `${Math.max(value.length * 8 + 20, 100)}px` : '120px' }}
            />
            {filter.icon && (
              <Icon
                name={filter.icon}
                size={iconSizes[size]}
                className="text-base-content flex-shrink-0"
              />
            )}
          </div>
        </div>
      );

    case "number":
      return (
        <div className={cn("relative inline-block", containerClassName)}>
          <div
            className={cn(
              "flex items-center gap-4 rounded-md border-1 transition-all",
              "bg-base-1",
              "border-base-content/40",
              sizeClasses[size]
            )}
          >
            <input
              type="number"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              min={filter.min}
              max={filter.max}
              placeholder={filter.placeholder || filter.label}
              className={cn(
                "bg-transparent outline-none placeholder:text-base-content/50 w-20",
                TEXT_SIZE_MAP[size],
                "text-base-content/50",
                // Hide spinner arrows
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
            {filter.icon && (
              <Icon
                name={filter.icon}
                size={iconSizes[size]}
                className="text-base-content flex-shrink-0"
              />
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};