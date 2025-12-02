import { cn } from "@/utils/helpers";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import {Label} from "../base/Label";

export interface ToggleButtonListItem<T extends string | number> {
  label: string;
  value: T;
}

interface ToggleButtonGroupProps<T extends string | number> {
  buttonList: ToggleButtonListItem<T>[];
  selected: ToggleButtonListItem<T>;
  onChange: (value: ToggleButtonListItem<T>) => void;
  fullWidth?: boolean;
  containerClassname?: string;
  label?: string;
  classname?: string;
  buttonClassname?: string;
  size?: "xs" | "sm" | "md";
  variant?: "filled" | "outlined";
}

const ToggleButtonGroup = <T extends string | number>(
  props: ToggleButtonGroupProps<T>,
): ReactNode => {
  const {
    buttonList,
    selected,
    onChange,
    buttonClassname,
    containerClassname,
    fullWidth,
    label = "",
    size = "md",
    classname,
    variant = "filled",
  } = props;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const index = buttonList.findIndex((b) => b.value === selected.value);
    const button = buttonRefs.current[index];
    const container = containerRef.current;

    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setHighlightStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [selected, buttonList]);

  if (variant === "outlined") {
    return (
      <div className={cn(fullWidth && "w-full", classname)}>
        {label && <Label className="mb-1"> {label} </Label>}
        <div
          className={cn(
            "border-neutral-content dark:border-base-3 relative flex gap-2 border-b",
            fullWidth ? "w-full" : "w-fit",
            containerClassname,
          )}
          ref={containerRef}
        >
          {/* Animated underline */}
          <span
            className="border-primary-600 dark:border-primary-50 absolute bottom-0 border-b-2 transition-all duration-300 ease-in-out"
            style={{
              left: highlightStyle.left,
              width: highlightStyle.width,
            }}
          />

          {buttonList.map((item, index) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item)}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                selected.value === item.value
                  ? "text-primary-600 dark:text-primary-50"
                  : "text-base-3 hover:text-neutral dark:text-base-2 dark:hover:text-neutral-content",
                buttonClassname,
                fullWidth && "flex-1",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(fullWidth && "w-full", classname)}>
      {label && <Label className="mb-1"> {label} </Label>}
      <div
        className={cn(
          "bg-neutral-content dark:bg-base-3 relative flex items-center gap-x-1 rounded-xl p-1",
          fullWidth ? "w-full" : "w-fit",
          containerClassname,
        )}
        ref={containerRef}
      >
        <span
          className="bg-primary-100/50 dark:bg-primary-600/50 absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out"
          style={{
            left: highlightStyle.left,
            width: highlightStyle.width,
          }}
        />

        {buttonList.map((item, index) => (
          <ToggleButton
            key={item.value}
            isActive={selected.value === item.value}
            onClick={() => onChange(item)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            buttonClassname={buttonClassname}
            fullWidth={fullWidth}
            size={size}
          >
            {item.label}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
};

interface ToggleButtonProps<T extends string | number> {
  children: ReactNode;
  isActive: boolean;
  fullWidth?: boolean;
  onClick: () => void;
  buttonClassname?: string;
  size?: ToggleButtonGroupProps<T>["size"];
}

const ToggleButton = React.forwardRef(
  <T extends string | number>(
    props: ToggleButtonProps<T>,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const {
      children,
      isActive,
      onClick,
      buttonClassname,
      fullWidth,
      size = "md",
    } = props;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative z-10 cursor-pointer rounded-lg text-sm font-semibold transition-colors",
          isActive ? activeButtonClass : notActiveButtonClass,
          sizeClasses[size],
          buttonClassname,
          fullWidth && "w-full",
        )}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

const sizeClasses: Record<"xs" | "sm" | "md", string> = {
  xs: "px-1.5 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

const activeButtonClass = `text-primary-500 dark:text-primary-50`;
const notActiveButtonClass = `text-base-3 dark:text-base-2 bg-transparent hover:bg-neutral-content hover:dark:bg-base-3`;

export default ToggleButtonGroup;
