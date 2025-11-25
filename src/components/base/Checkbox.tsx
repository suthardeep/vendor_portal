import React, { forwardRef } from "react";
import { cn } from "@/utils/helpers";
import Label from "./Label";
import ErrorText from "./ErrorText";

export interface CheckboxProps {
  label?: string | React.ReactNode;
  labelClassName?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      labelClassName,
      checked = false,
      onChange,
      onBlur,
      name,
      error,
      success = false,
      helperText,
      required = false,
      disabled = false,
      fullWidth = false,
      containerClassName,
      className,
      inputClassName,
      size = "md",
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(e.target.checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        onChange?.(!checked);
      }
    };

    return (
      <div className={cn("space-y-1 flex flex-col", fullWidth && "w-full", containerClassName)}>
        <div className="flex items-start gap-3">
          <div className="relative flex items-center">
            <input
              id={name ?? (label as string)}
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              onBlur={onBlur}
              name={name ?? (label as string)}
              disabled={disabled}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                "appearance-none cursor-pointer border rounded transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                sizeClasses[size],
                "border-input-border bg-base-1",
                checked && "bg-primary border-primary",
                checked && error && "bg-error border-error",
                checked && success && !error && "bg-success border-success",
                error && !checked && "border-error",
                success && !error && !checked && "border-success",
                disabled && "opacity-50 cursor-not-allowed bg-base-2",
                !error && !success && "focus:ring-primary/30",
                error && "focus:ring-error/30",
                success && !error && "focus:ring-success/30",
                inputClassName
              )}
              onKeyDown={handleKeyDown}
              {...props}
            />

            {(checked || indeterminate) && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center pointer-events-none",
                  "text-white transition-all duration-200"
                )}
              >
                {indeterminate ? (
                  <div
                    className={cn(
                      "bg-current rounded-sm",
                      size === "sm" && "w-2 h-0.5",
                      size === "md" && "w-2.5 h-0.5",
                      size === "lg" && "w-3 h-0.5"
                    )}
                  />
                ) : (
                  <svg
                    className={cn(
                      "fill-current",
                      size === "sm" && "w-3 h-3",
                      size === "md" && "w-3.5 h-3.5",
                      size === "lg" && "w-4 h-4"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>

          {label && (
            <Label
              required={required}
              className={cn(
                "cursor-pointer select-none",
                error && "text-error",
                success && !error && "text-success",
                disabled && "opacity-50 cursor-not-allowed",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-sm",
                labelClassName
              )}
              htmlFor={name ?? (label as string)}
            >
              {label}
            </Label>
          )}
        </div>

        {(helperText || error) && (
          <ErrorText
            className={cn(
              error ? "text-error" : "text-body-content",
              "ml-0",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-sm"
            )}
          >
            {error || helperText}
          </ErrorText>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
