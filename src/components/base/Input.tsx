import { cn } from "@/utils/helpers";
import React, { forwardRef, type InputHTMLAttributes, ReactNode, useState } from "react";
import {Label} from "./Label";
import {ErrorText} from "./ErrorText";
import {Icon, IconName } from "./Icon";

type InputHTMLAttributesWithoutConflicts = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
>;

export interface InputProps extends InputHTMLAttributesWithoutConflicts {
  label?: string;
  name?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  required?: boolean;
  variant?: "outlined" | "filled" | "transparent";
  inputSize?: "sm" | "md" | "lg";
  togglePassword?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  inputWrapperClassName?: string;
  className?: string;
  labelClassName?: string;
  leftElementClassname?: string;
  rightElementClassname?: string;
  formProps?: any;
  numericOnly?: boolean;
  maxLength?: number;

  tooltip?: string|ReactNode;
  tooltipIcon?: IconName;
  
  extraLabel?: string;
  extraLabelPosition?: "top-right" | "bottom-left" | "bottom-right";
  extraLabelClassName?: string;
  
  isVerified?: boolean;
  showStatus?: boolean;
  verifiedText?: string;
  unverifiedText?: string;
  statusClassName?: string;
}

export type InputRef = HTMLInputElement;

const borderClasses = {
  default: "border-input-border",
  error: "border-error",
  success: "border-success",
};

const textClasses = {
  primary: "text-base-content",
  placeholder: "placeholder:text-disabled-content",
};

const backgroundClasses = {
  primary: "bg-base-1",
  secondary: "bg-base-2",
  transparent: "bg-transparent",
};

const disabledClasses =
  "disabled:bg-base-2 disabled:text-disabled-content disabled:cursor-not-allowed disabled:opacity-70";

const toggleButtonClasses =
  "cursor-pointer transition-colors duration-200 focus:outline-none text-body-content hover:text-base-content";

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      name,
      labelClassName,
      helperText,
      error,
      success = false,
      rightElement,
      leftElement,
      required = false,
      fullWidth = false,
      variant = "filled",
      inputSize = "md",
      type = "text",
      disabled = false,
      togglePassword = false,
      inputWrapperClassName,
      leftElementClassname = "",
      rightElementClassname = "",
      onChange,
      formProps,
      numericOnly = false,
      maxLength,
      extraLabel,
      extraLabelPosition = "top-right",
      extraLabelClassName,
      isVerified = false,
      showStatus = false,
      verifiedText = "Verified",
      unverifiedText = "Need verification",
      statusClassName,

      tooltip,
      tooltipIcon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const sizeClasses = {
      sm: "text-xs py-1.5 px-2.5",
      md: "text-sm py-1.5 md:py-2 px-3",
      lg: "text-sm py-2.5 md:py-3 px-3",
    };

    const getVariantClasses = () => {
      const baseClasses = "border transition-all duration-200 ease-in-out";

      // Priority: error > success > default
      const getBorderClass = () => {
        if (error) return borderClasses.error;
        if (success) return borderClasses.success;
        return borderClasses.default;
      };

      switch (variant) {
        case "outlined":
          return cn(
            baseClasses,
            backgroundClasses.secondary,
            getBorderClass(),
          );
        case "filled":
          return cn(
            baseClasses,
            backgroundClasses.primary,
            getBorderClass(),
          );
        case "transparent":
          return cn(
            baseClasses,
            backgroundClasses.transparent,
            "border-transparent",
            (error || success) && getBorderClass(),
          );
        default:
          return baseClasses;
      }
    };

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (numericOnly || type === "tel") {
        value = value.replace(/\D/g, "");
        if (maxLength && value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
        e.target.value = value;
      } else if (type === "number") {
        value = value === "" || isNaN(Number(value)) ? "" : value;
        e.target.value = value;
      }

      onChange?.(e);
    };

    const labelColorClass = error 
      ? "text-error" 
      : success 
      ? "text-success" 
      : "";

    const isExtraLabelTop = extraLabelPosition === "top-right";
    const isExtraLabelRight = extraLabelPosition === "top-right" || extraLabelPosition === "bottom-right";

    return (
      <div
        className={cn(
          "space-y-1 flex flex-col",
          fullWidth && "w-full",
          containerClassName
        )}
      >
        {/* Top labels row */}
        {(label || (extraLabel && isExtraLabelTop)) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <Label 
                required={required}
                className={cn(labelColorClass, labelClassName)}
                tooltip={tooltip}
                tooltipIcon={tooltipIcon}
              >
                {label}
              </Label>
            )}
            {extraLabel && isExtraLabelTop && (
              <span className={cn(
                "text-xs text-body-content",
                extraLabelClassName
              )}>
                {extraLabel}
              </span>
            )}
          </div>
        )}
        
        <div className="w-full space-y-1">
          <div
            className={cn(
              "flex overflow-hidden rounded-lg",
              getVariantClasses(),
              inputWrapperClassName,
            )}
          >
            {leftElement && (
              <div
                className={cn(
                  "pointer-events-none flex aspect-square items-center justify-center p-2",
                  leftElementClassname,
                )}
              >
                {leftElement}
              </div>
            )}
            <input
              ref={ref}
              name={name}
              type={inputType}
              inputMode={numericOnly || type === "tel" ? "numeric" : undefined}
              className={cn(
                "appearance-none w-full bg-transparent transition-colors outline-none read-only:cursor-default",
                textClasses.primary,
                textClasses.placeholder,
                disabledClasses,
                sizeClasses[inputSize],
                leftElement && "pl-0",
                (rightElement || (togglePassword && type === "password")) &&
                  "pr-3",
                className,
              )}
              disabled={disabled}
              aria-invalid={error ? "true" : "false"}
              onChange={handleChange}
              maxLength={maxLength}
              {...props}
              {...formProps}
            />
            {(rightElement || (togglePassword && type === "password") || (isVerified && showStatus && !error)) && (
              <div
                className={cn("flex items-center pr-2", rightElementClassname)}
              >
                {togglePassword && type === "password" ? (
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={toggleButtonClasses}
                    tabIndex={-1}
                    disabled={disabled}
                  >
                    {showPassword ? 
                   
                    <Icon name="EyeOff" size={20}></Icon> :<Icon name="Eye" size={20}></Icon>}
                  </button>
                ) : isVerified && showStatus && !error ? (
                 <Icon 
                  name="CheckCircle2"
                  size={inputSize === "sm" ? 16 : inputSize === "md" ? 20 : 24}
                  className="shrink-0 text-success"
                  aria-label="Verified"
/>
                ) : (
                  rightElement
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-2">
            {(helperText || error) && (   
               <ErrorText className={error ? "text-xs text-error" : "text-xs text-body-content"}>
                {error || helperText}
              </ErrorText>
            )}
            
            {!error && !helperText && showStatus && (
              <span className={cn(
                "text-xs font-medium",
                isVerified ? "text-success ml-auto" : "text-body-content ml-auto",
                statusClassName
              )}>
                {isVerified ? verifiedText : unverifiedText}
              </span>
            )}
            
            {extraLabel && !isExtraLabelTop && (
              <span className={cn(
                "text-xs text-body-content",
                !isExtraLabelRight && "mr-auto",
                isExtraLabelRight && "ml-auto",
                extraLabelClassName
              )}>
                {extraLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };