import React, { type InputHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";
import {Label} from "./Label";
import {ErrorText} from "./ErrorText";

const dateTimeInputVariants = cva(
  "flex items-center gap-2 sm:gap-3 w-full rounded-lg border transition-all duration-200",
  {
    variants: {
      state: {
        default: "border-[var(--input-border)]",
        error: "border-error",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3 py-1.5 md:py-2 text-sm",
        lg: "px-3 py-2.5 md:py-3 text-sm",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

export interface DateTimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: "date" | "datetime-local";
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  (
    {
      label,
      value,
      onValueChange,
      onChange,
      size = "md",
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      iconClassName,
      errorClassName,
      disabled = false,
      placeholder,
      required = false,
      name,
      onBlur,
      className,
      type = "date",
      ...props
    },
    ref
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };


    console.log("error" , error)

    const state = error ? "error" : "default";

    return (
      <div className={cn("w-full space-y-1", containerClassName)}>
        {label && (
          <Label required={required} className={error ? "text-error" : labelClassName}>
            {label}
          </Label>
        )}

        <div className="relative">
          <div className={cn(dateTimeInputVariants({ state, size }), className)}>
            <input
              ref={ref}
              type={type}
              value={value}
              onChange={handleInputChange}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              name={name}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                "flex-1 bg-transparent outline-none text-body-content placeholder:text-disabled-content min-w-0",
                disabled && "cursor-not-allowed opacity-50",
                inputClassName
              )}
              {...props}
            />

           
          </div>

          {error && (
            <div className="mt-1 sm:mt-2">
              <ErrorText className={cn("text-xs text-error", errorClassName)}>
                {error}
              </ErrorText>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };