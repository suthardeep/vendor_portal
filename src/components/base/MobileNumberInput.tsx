import React, { type InputHTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";
import Label from "./Label";
import ErrorText from "./ErrorText";
import Icon from "./Icon";

const mobileInputVariants = cva(
  "flex items-center gap-2 sm:gap-3 w-full rounded-lg border transition-all duration-200",
  {
    variants: {
      state: {
        default: "border-[var(--input-border)]",
        error: "border-error",
        verified: "border-success",
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

const statusTextVariants = cva("font-medium transition-colors duration-200", {
  variants: {
    state: {
      default: "text-body-content",
      verified: "text-success",
      error: "text-error",
    },
    size: {
      sm: "text-xs",
      md: "text-xs sm:text-sm",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    state: "default",
    size: "md",
  },
});

export interface MobileNumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  countryCode?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  isVerified?: boolean;
  maxLength?: number;
  size?: "sm" | "md" | "lg";
  unverifiedText?: string;
  verifiedText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  statusClassName?: string;
  prefixClassName?: string;
  errorClassName?: string;
  showStatus?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const MobileNumberInput = forwardRef<HTMLInputElement, MobileNumberInputProps>(
  (
    {
      label = "Mobile Number",
      countryCode = "+91",
      value,
      onValueChange,
      onChange,
      isVerified = true,
      maxLength = 10,
      size = "md",
      unverifiedText = "Need verification",
      verifiedText = "Verified",
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      statusClassName,
      prefixClassName,
      errorClassName,
      showStatus = true,
      disabled = false,
      placeholder = "Type here",
      required = false,
      name,
      onBlur,
      className,
      ...props
    },
    ref
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/\D/g, "");

      if (numericValue.length <= maxLength) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
        onValueChange?.(numericValue);
      }
    };

    const state = error ? "error" : isVerified ? "verified" : "default";
    const statusText = isVerified ? verifiedText : unverifiedText;

    return (
      <div className={cn("w-full space-y-1", containerClassName)}>
        {label && (
          <Label required={true} className={error ? "text-error" : ""}>
            {label}
          </Label>
        )}

        <div className="relative">
          <div className={cn(mobileInputVariants({ state, size }), className)}>
            <span
              className={cn(
                "font-medium text-base-content shrink-0",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-sm",
                disabled && "opacity-50",
                prefixClassName
              )}
            >
              {countryCode}
            </span>

            <input
              ref={ref}
              type="text"
              inputMode="numeric"
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

            {isVerified && showStatus && !error && (
              <Icon
                name="CheckCircle2"
                size={size === "sm" ? 16 : size === "md" ? 20 : 24}
                className="flex-shrink-0 text-success"
              />
            )}
          </div>

          {(showStatus || error) && (
            <div className="mt-1 sm:mt-2 flex justify-between items-start gap-2">
              {error ? (
                <ErrorText className={error ? "text-xs text-error" : "text-xs text-body-content"}>
                  {error}
                </ErrorText>
              ) : (
                showStatus && (
                  <span
                    className={cn(
                      statusTextVariants({ state, size }),
                      "text-right whitespace-nowrap overflow-hidden truncate max-w-[14rem] ml-auto",
                      statusClassName
                    )}
                  >
                    {statusText}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MobileNumberInput.displayName = "MobileNumberInput";

export { MobileNumberInput };
