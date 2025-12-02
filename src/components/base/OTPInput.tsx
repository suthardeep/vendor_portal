import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";
import {Label} from "./Label";
import {ErrorText} from "./ErrorText";

const otpBoxVariants = cva(
  "flex items-center justify-center rounded-lg border bg-transparent transition-all duration-200 outline-none text-center font-medium",
  {
    variants: {
      state: {
        default: "border-[var(--input-border)] text-body-content",
        error: "border-error text-body-content",
        filled: "border-primary text-base-content",
      },
      size: {
        sm: "size-10 text-sm",
        md: "size-12 text-base sm:size-14 sm:text-lg",
        lg: "size-14 text-lg sm:size-16 sm:text-xl",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  boxClassName?: string;
  errorClassName?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
  required?: boolean;
  phoneNumber?: string;
  email?: string;
  showChangeLink?: boolean;
  onChangeClick?: () => void;
}

export interface OTPInputRef {
  focus: () => void;
  clear: () => void;
}

const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      onComplete,
      size = "md",
      error,
      containerClassName,
      labelClassName,
      boxClassName,
      errorClassName,
      disabled = false,
      label,
      name,
      required = false,
      phoneNumber,
      email,
      showChangeLink = true,
      onChangeClick,
    },
    ref
  ) => {
    const [otp, setOtp] = useState(value.split(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRefs.current[0]?.focus();
      },
      clear: () => {
        setOtp(Array(length).fill(""));
        onChange?.("");
        inputRefs.current[0]?.focus();
      },
    }));

    const handleChange = (index: number, val: string) => {
      if (disabled) return;

      const numericValue = val.replace(/\D/g, "");
      
      if (numericValue.length > 1) {
        const digits = numericValue.slice(0, length).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (index + i < length) {
            newOtp[index + i] = digit;
          }
        });
        setOtp(newOtp);
        const fullValue = newOtp.join("");
        onChange?.(fullValue);
        
        const nextIndex = Math.min(index + digits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        
        if (fullValue.length === length) {
          onComplete?.(fullValue);
        }
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      const fullValue = newOtp.join("");
      onChange?.(fullValue);

      if (numericValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (fullValue.length === length) {
        onComplete?.(fullValue);
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newOtp = [...otp];
        
        if (otp[index]) {
          newOtp[index] = "";
          setOtp(newOtp);
          onChange?.(newOtp.join(""));
        } else if (index > 0) {
          newOtp[index - 1] = "";
          setOtp(newOtp);
          onChange?.(newOtp.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
      const digits = pastedData.slice(0, length).split("");
      const newOtp = Array(length).fill("");
      
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      
      setOtp(newOtp);
      const fullValue = newOtp.join("");
      onChange?.(fullValue);
      
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      if (fullValue.length === length) {
        onComplete?.(fullValue);
      }
    };

    const state = error ? "error" : otp.some(val => val) ? "filled" : "default";

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {(label || phoneNumber || email) && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label required={required} className={cn(error && "text-error", labelClassName)}>
              {label || "Register Mobile number"}{" "}
              {phoneNumber && <span className="font-semibold">{phoneNumber}</span>}
              {email && <span className="font-semibold">{email}</span>}
            </Label>
            {showChangeLink && (
              <button
                type="button"
                onClick={onChangeClick}
                className="text-sm text-disabled-content underline hover:text-body-content transition-colors"
              >
                change?
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-left gap-2 sm:gap-3">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              name={name ? `${name}-${index}` : undefined}
              aria-label={`OTP digit ${index + 1}`}
              aria-invalid={!!error}
              className={cn(
                otpBoxVariants({ state, size }),
                disabled && "cursor-not-allowed opacity-50",
                boxClassName
              )}
            />
          ))}
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

OTPInput.displayName = "OTPInput";

export { OTPInput };