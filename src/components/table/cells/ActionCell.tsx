import { cn } from "@/utils/helpers";
import React, { useRef, useEffect, useState } from "react";
import {Icon} from "../../base/Icon";
import { ActionMenuItem } from "../table.types";
import { IconName } from "demaze-ui-lib/components";

interface ActionCellProps {
  row: any;
  actions?: ActionMenuItem[];
  singleIcon?: {
    name: string;
    onClick: (row: any) => void;
    tooltip?: string;
  };
}

export const ActionCell: React.FC<ActionCellProps> = ({ row, actions, singleIcon }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    console.log("ActionCell singleIcon:", singleIcon);
    console.log("ActionCell actions:", actions);

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      calculatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const calculatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = actions ? (actions.length * 48) + 16 : 200;
    
    // Calculate position relative to viewport
    let top = buttonRect.bottom + window.scrollY + 8; // Default: below button
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    
    // If not enough space below, show above the button
    if (spaceBelow < dropdownHeight) {
      top = buttonRect.top + window.scrollY - dropdownHeight - 8;
    }

    const left = buttonRect.right - 192; // 192 = 48 (dropdown width) * 4 (approx)

    setDropdownStyle({
      top: Math.max(8, top), // Ensure it doesn't go above viewport
      left: Math.max(8, left) // Ensure it doesn't go beyond left edge
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Single icon case
  if (singleIcon) {
    return (
      <button
        onClick={() => singleIcon.onClick(row)}
        title={singleIcon.tooltip}
        className="p-1 hover:bg-base-3 rounded transition-colors"
      >
        <Icon name={singleIcon.name as any} size={18} className="text-body-content" />
      </button>
    );
  }

  // No actions case
  if (!actions || actions.length === 0) {
    return null;
  }

  // Dropdown menu case
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1 hover:bg-base-3 rounded transition-colors inline-flex items-center justify-center"
      >
        <Icon name="MoreVertical" size={18} className="text-body-content" />
      </button>

      {isOpen && (
        <div 
          className="fixed w-48 bg-base-1 rounded-lg shadow-lg z-[9999] origin-top-right overflow-hidden "
          style={dropdownStyle}
        >
          <div className="py-1">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick?.(row);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-xl text-left transition-colors relative hover:cursor-pointer",
                  action.variant === "danger"
                    ? "text-error hover:bg-error-content"
                    : "text-base-content hover:bg-base-2",
                  idx !== actions.length - 1 && "after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:bg-base-content/20"
                )}
              >
                {action.icon && (
                  <Icon 
                    name={action.icon as IconName} 
                    className="text-base-content" 
                    size={16} 
                  />
                )}
                <span className="font-normal">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};