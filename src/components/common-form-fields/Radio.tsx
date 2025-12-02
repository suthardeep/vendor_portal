import React, { forwardRef } from "react";
import { cn } from "@/utils/helpers";
import {Label} from "@/components/base/Label";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  error?: string;
  labelPosition?: "left" | "right";
  wrapperClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error,
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
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const getRadioClasses = () => {
      if (hasError) {
        return checked
          ? cn(
              radioBaseClasses,
              checkedHoverClass,
              errorCheckedClasses,
              sizeClass.radio,
              className,
            )
          : cn(
              radioBaseClasses,
              baseHoverClass,
              errorClasses,
              sizeClass.radio,
              className,
            );
      }

      return checked
        ? cn(
            radioBaseClasses,
            checkedHoverClass,
            checkedClasses,
            sizeClass.radio,
            className,
          )
        : cn(radioBaseClasses, baseHoverClass, sizeClass.radio, className);
    };

    const renderRadio = () => (
      <div className="relative shrink-0 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        <Label
          htmlFor={radioId}
          className={cn(
            getRadioClasses(),
            "flex shrink-0 items-center justify-center",
          )}
        >
          <span
            className={cn(
              "bg-primary-500 dark:bg-primary-500 rounded-full transition-opacity duration-200",
              "disabled:bg-primary-300 dark:disabled:bg-primary-300",
              sizeClass.innerCircle,
              checked ? "opacity-100" : "opacity-0",
            )}
          />
        </Label>
      </div>
    );

    const renderLabel = () => {
      if (!label) return null;

      return (
        <Label
          htmlFor={radioId}
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
        {renderRadio()}
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

Radio.displayName = "Radio";

export default Radio;

const sizeClasses = {
  sm: {
    radio: "w-4 h-4",
    innerCircle: "w-2 h-2",
    label: "text-xs",
    helper: "text-xs",
    gap: "gap-1",
    helperOffset: "ml-6",
  },
  md: {
    radio: "w-5 h-5",
    innerCircle: "w-2.5 h-2.5",
    label: "text-sm",
    helper: "text-xs",
    gap: "gap-2.5",
    helperOffset: "ml-7.5",
  },
  lg: {
    radio: "w-6 h-6",
    innerCircle: "w-3 h-3",
    label: "text-base",
    helper: "text-sm",
    gap: "gap-3",
    helperOffset: "ml-9",
  },
};

const radioBaseClasses = cn(
  "relative flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral",
  "border-base-2 dark:border-base-3 bg-white dark:bg-base-3",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-base-2 dark:disabled:hover:border-base-3",
  "disabled:hover:bg-white dark:disabled:hover:bg-base-3",
);

const baseHoverClass =
  "hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/40";

const checkedClasses = cn(
  "border-primary-500 dark:border-primary-500",
  "disabled:border-primary-300 dark:disabled:border-primary-300",
);

const checkedHoverClass = "hover:border-primary-600 dark:hover:border-primary-600";

const errorClasses = cn(
  "border-base-3 dark:border-neutral-500",
  "hover:border-base-3 dark:hover:border-neutral-600",
  "focus-visible:ring-base-3 dark:focus-visible:ring-neutral-500",
);

const errorCheckedClasses = cn(
  "border-base-3 dark:border-neutral-500",
  "hover:border-base-3 dark:hover:border-neutral-600",
);
