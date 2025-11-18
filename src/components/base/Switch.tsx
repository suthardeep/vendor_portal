import { cva } from "class-variance-authority";
import React, { useState, forwardRef, type InputHTMLAttributes } from "react";
import Label from "./Label";
import { cn } from "@/utils/helpers";
import ErrorText from "./ErrorText";

// -----------------------------------------------------------------
// 1. CVA VARIANT DEFINITIONS
// -----------------------------------------------------------------

// Visual Reference: Rectangular track with rounded corners (not full pill)
const trackVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      size: {
        sm: "h-6 w-10 rounded-sm", // Smaller, tighter rounding
        md: "h-7 w-12 rounded-sm", // Standard, slightly more rounding
        lg: "h-9 w-16 rounded-sm", // Large
      },
      state: {
        unchecked: "bg-[#47485738] border-transparent", // Greyish background when off
        checked: "bg-primary border-primary", // Primary color when on
        error: "bg-error border-error",
        disabled: "opacity-50 cursor-not-allowed bg-base-200 border-base-200",
      },
    },
    defaultVariants: {
      size: "md",
      state: "unchecked",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        sm: "size-4 rounded-sm", // Square-ish rounded corners
        md: "size-5 rounded-sm",
        lg: "size-7 rounded-sm",
      },
      state: {
        unchecked: "translate-x-1", // Start with a little offset padding
        checked: "", // Translation handled dynamically below
        error: "",
        disabled: "bg-base-100",
      },
    },
    defaultVariants: {
      size: "md",
      state: "unchecked",
    },
  }
);


// -----------------------------------------------------------------
// 2. TYPE DEFINITIONS
// -----------------------------------------------------------------

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  onCheckedChange?: (checked: boolean) => void;
  containerClassName?: string;
  labelClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  errorClassName?: string;
  description?: string;
  /** Label position relative to the switch */
  labelPosition?: "left" | "right"; 
}


// -----------------------------------------------------------------
// 3. COMPONENT IMPLEMENTATION
// -----------------------------------------------------------------

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      error,
      size = "md",
      disabled = false,
      required = false,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      containerClassName,
      labelClassName,
      trackClassName,
      thumbClassName,
      errorClassName,
      className,
      labelPosition = "right",
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState<boolean>(!!defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    const inputId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const newChecked = event.target.checked;
      if (controlledChecked === undefined) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    // Calculate state for CVA
    let state: "checked" | "unchecked" | "error" | "disabled" = isChecked ? "checked" : "unchecked";
    if (disabled) state = "disabled";
    else if (error) state = "error";

    // Translation logic (Thumb movement)
    // We calculate specific translations to ensure the thumb stays inside the track with padding
    const translateClasses = {
      sm: isChecked ? "translate-x-4.5" : "translate-x-0.5",
      md: isChecked ? "translate-x-5.5" : "translate-x-0.5",
      lg: isChecked ? "translate-x-7.5" : "translate-x-0.5",
    };

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        <div className="flex items-center gap-2">
          {/* Left Label */}
          {label && labelPosition === "left" && (
             <Label 
               htmlFor={inputId} 
               required={required} 
               className={cn("mb-0 cursor-pointer", error && "text-error", labelClassName)}
             >
               {label}
             </Label>
          )}

          {/* Switch Track */}
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
              checked={isChecked}
              disabled={disabled}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className="peer sr-only m-0"
              {...props}
            />
            
            <label
              htmlFor={inputId}
              className={cn(
                trackVariants({ size, state }),
                // Use items-center to vertically center the thumb
                "items-center", 
                trackClassName,
                className
              )}
            >
              <span
                className={cn(
                  thumbVariants({ size, state: disabled ? "disabled" : "unchecked" }), // Base thumb style
                  translateClasses[size], // Dynamic translation
                  thumbClassName
                )}
              />
            </label>
          </div>

          {/* Right Label (Default) */}
          {label && labelPosition === "right" && (
            <Label 
              htmlFor={inputId} 
              required={required} 
              className={cn("mb-0 cursor-pointer", error && "text-error", labelClassName)}
            >
              {label}
            </Label>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <ErrorText className={errorClassName}>
            {error}
          </ErrorText>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;