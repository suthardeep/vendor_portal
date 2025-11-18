import React, { type InputHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";
import Label from "./Label";
import ErrorText from "./ErrorText";

const radioVariants = cva(
  "flex items-center justify-center rounded-full border-1 transition-all duration-200 cursor-pointer shrink-0",
  {
    variants: {
      state: {
        default: "border-[var(--input-border)]",
        error: "border-error",
        checked: "border-primary",
      },
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

const radioDotVariants = cva("rounded-full bg-primary transition-all duration-200", {
  variants: {
    size: {
      sm: "size-2.5",
      md: "size-3",
      lg: "size-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const labelTextVariants = cva("cursor-pointer select-none", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  containerClassName?: string;
  groupClassName?: string;
  labelClassName?: string;
  radioClassName?: string;
  optionLabelClassName?: string;
  errorClassName?: string;
  disabled?: boolean;
  required?: boolean;
  name: string;
  orientation?: "horizontal" | "vertical";
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      size = "md",
      error,
      label,
      containerClassName,
      groupClassName,
      labelClassName,
      radioClassName,
      optionLabelClassName,
      errorClassName,
      disabled = false,
      required = false,
      name,
      orientation = "horizontal",
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || "");
    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (optionValue: string) => {
      if (!disabled) {
        if (value === undefined) {
          setInternalValue(optionValue);
        }
        onValueChange?.(optionValue);
      }
    };

    return (
      <div ref={ref} className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <Label required={required} className={cn(error && "text-error", labelClassName)}>
            {label}
          </Label>
        )}

        <div
          className={cn(
            "flex gap-4 sm:gap-6",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
            groupClassName
          )}
        >
          {options.map((option) => {
            const isChecked = currentValue === option.value;
            const isDisabled = disabled || option.disabled;
            const state = error ? "error" : isChecked ? "checked" : "default";

            return (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-2 sm:gap-3",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    onChange={() => handleChange(option.value)}
                    disabled={isDisabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className="sr-only"
                  />

                  <div
                    className={cn(
                      radioVariants({ state, size }),
                      isDisabled && "cursor-not-allowed",
                      radioClassName
                    )}
                  >
                    {isChecked && <div className={cn(radioDotVariants({ size }))} />}
                  </div>
                </div>

                <span
                  className={cn(
                    labelTextVariants({ size }),
                    "text-body-content",
                    error && "text-error",
                    optionLabelClassName
                  )}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {error && (
          <div className="mt-1 sm:mt-2">
            <ErrorText className={cn("text-xs text-error", errorClassName)}>
              {error}
            </ErrorText>
          </div>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };