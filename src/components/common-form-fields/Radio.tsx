import React, { forwardRef } from "react";
import { cn } from "@/utils/helpers";
import Label from "@/components/base/Label";

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
              "bg-pl-500 dark:bg-pd-500 rounded-full transition-opacity duration-200",
              "disabled:bg-pl-300 dark:disabled:bg-pd-300",
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
                "text-nl-600 dark:text-nd-300",
                hasError && "text-dl-500 dark:text-dd-500",
                sizeClass.helper,
                helperClassName,
              )}
            >
              {text}
            </p>
          )}
          {description && (
            <p className={cn("text-nl-500 dark:text-nd-400", sizeClass.helper)}>
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-nd-800",
  "border-nl-300 dark:border-nd-500 bg-white dark:bg-nd-700",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-nl-300 dark:disabled:hover:border-nd-500",
  "disabled:hover:bg-white dark:disabled:hover:bg-nd-700",
);

const baseHoverClass =
  "hover:border-pl-400 dark:hover:border-pd-600 hover:bg-pl-50 dark:hover:bg-pd-500/40";

const checkedClasses = cn(
  "border-pl-500 dark:border-pd-500",
  "disabled:border-pl-300 dark:disabled:border-pd-300",
);

const checkedHoverClass = "hover:border-pl-600 dark:hover:border-pd-600";

const errorClasses = cn(
  "border-dl-500 dark:border-dd-500",
  "hover:border-dl-600 dark:hover:border-dd-600",
  "focus-visible:ring-dl-500 dark:focus-visible:ring-dd-500",
);

const errorCheckedClasses = cn(
  "border-dl-500 dark:border-dd-500",
  "hover:border-dl-600 dark:hover:border-dd-600",
);
