import React, { forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/helpers";
import Label from "./Label";

const sizeClasses = {
  sm: {
    checkbox: "w-4 h-4",
    icon: "w-2.5 h-2.5",
    label: "text-xs",
    helper: "text-xs",
    gap: "gap-1",
    helperOffset: "ml-6",
    roundness: "rounded-sm",
  },
  md: {
    checkbox: "w-5 h-5",
    icon: "w-3 h-3",
    label: "text-sm",
    helper: "text-xs",
    gap: "gap-2.5",
    helperOffset: "ml-7.5",
    roundness: "rounded-md",
  },
  lg: {
    checkbox: "w-6 h-6",
    icon: "w-4 h-4",
    label: "text-base",
    helper: "text-sm",
    gap: "gap-3",
    helperOffset: "ml-9",
    roundness: "rounded-md",
  },
};

const checkboxBaseClasses = cn(
  "relative flex items-center justify-center border-[1.5px] transition-all duration-200 cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral",
  "border-base-2 dark:border-base-3 bg-white dark:bg-base-3",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-base-2 dark:disabled:hover:border-base-3",
  "disabled:hover:bg-white dark:disabled:hover:bg-base-3",
);

const baseHoverClass =
  "hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/40";

const checkedClasses = cn(
  "!border-[transparent] bg-primary-500 dark:bg-primary-500",
  "disabled:border-primary-300 dark:disabled:border-primary-300 disabled:bg-primary-300 dark:disabled:bg-primary-300",
);

const checkedHoverClass =
  "hover:border-[transparent] hover:bg-primary-600 dark:hover:bg-primary-600";

const errorClasses = cn(
  "border-base-3 dark:border-neutral-500",
  "hover:border-base-3 dark:hover:border-neutral-600",
  "focus-visible:ring-base-3 dark:focus-visible:ring-neutral-500",
);

const errorCheckedClasses = cn(
  "border-base-3 dark:border-neutral-500 bg-base-3 dark:bg-neutral-500",
  "hover:border-base-3 dark:hover:border-neutral-600 hover:bg-base-3 dark:hover:bg-neutral-600",
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
  labelPosition?: "left" | "right";
  wrapperClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error,
      indeterminate = false,
      labelPosition = "right",
      wrapperClassName,
      labelClassName,
      helperClassName,
      description,
      className,
      disabled,
      checked,
      id,
      ...props
    },
    ref,
  ) => {
    const sizeClass = sizeClasses[size];
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const getCheckboxClasses = () => {
      if (hasError) {
        return checked || indeterminate
          ? cn(
              checkboxBaseClasses,
              checkedHoverClass,
              errorCheckedClasses,
              className,
            )
          : cn(checkboxBaseClasses, baseHoverClass, errorClasses, className);
      }

      return checked || indeterminate
        ? cn(checkboxBaseClasses, checkedHoverClass, checkedClasses, className)
        : cn(checkboxBaseClasses, baseHoverClass, className);
    };

    const renderCheckbox = () => (
      <div className="relative shrink-0 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        <Label
          htmlFor={checkboxId}
          className={cn(
            getCheckboxClasses(),
            sizeClass.checkbox,
            sizeClass.roundness,
            "flex shrink-0 items-center justify-center",
          )}
        >
          <span
            className={cn(
              "flex w-full shrink-0 items-center justify-center transition-opacity duration-200",
              checked || indeterminate ? "opacity-100" : "opacity-0",
            )}
          >
            {indeterminate ? (
              <Minus
                className={cn("text-neutral-content dark:text-white", sizeClass.icon)}
                strokeWidth={3}
              />
            ) : (
              <Check
                className={cn("text-neutral-content dark:text-white", sizeClass.icon)}
                strokeWidth={3}
              />
            )}
          </span>
        </Label>
      </div>
    );

    const renderLabel = () => {
      if (!label) return null;

      return (
        <Label
          htmlFor={checkboxId}
          className={cn(
            "cursor-pointer leading-none select-none",
            disabled && "cursor-not-allowed opacity-50",
            sizeClass.label,
            labelClassName,
          )}
        >
          {label}
        </Label>
      );
    };

    const renderHelperText = () => {
      const text = hasError ? error : helperText;
      if (!text && !description) return null;

      return (
        <div className="space-y-1">
          {text && (
            <p
              className={cn(
                "text-base-3 dark:text-base-2",
                hasError && "text-base-3 dark:text-neutral-500",
                sizeClass.helper,
                helperClassName,
              )}
            >
              {text}
            </p>
          )}
          {description && (
            <p className={cn("text-base-3 dark:text-base-2", sizeClass.helper)}>
              {description}
            </p>
          )}
        </div>
      );
    };

    const content = (
      <>
        {labelPosition === "left" && renderLabel()}
        {renderCheckbox()}
        {labelPosition === "right" && renderLabel()}
      </>
    );

    return (
      <div className={cn("inline-block", wrapperClassName)}>
        <div className={cn("flex items-start", sizeClass.gap)}>{content}</div>
        {(helperText || error || description) && (
          <div
            className={cn(
              "mt-1.5",
              labelPosition === "left" ? "mr-auto" : "ml-0",
              labelPosition === "right" && label && sizeClass.helperOffset,
            )}
          >
            {renderHelperText()}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
