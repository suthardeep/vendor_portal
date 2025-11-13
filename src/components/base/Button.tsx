import { cva } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/helpers";
import Spinner from "../compound/spinner/Spinner";
import { getColorClasses } from "../utils/getButtonColor";

export type ButtonVariant = "filled" | "outline" | "ghost" | "link" | "text";
type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "primary" | "neutral" | "success" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  color?: ButtonColor;
  startIconClassname?: string;
  endIconClassname?: string;
}

const buttonVariants = cva(
  "inline-flex items-center text-nowrap justify-center cursor-pointer font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 transition-all disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "text-xs px-2 py-1.5 rounded-md",
        md: "text-sm font-medium px-3 py-2 rounded-lg",
        lg: "text-base px-4 py-2 rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const getSizeClasses = (size: ButtonSize = "md") => {
  const sizeMap = {
    sm: {
      container: "max-h-4",
      contentHeight: "h-4",
      translate: "-translate-y-4",
      iconSize: "size-3.5",
    },
    md: {
      container: "max-h-5",
      contentHeight: "h-5",
      translate: "-translate-y-5",
      iconSize: "size-4",
    },
    lg: {
      container: "max-h-6",
      contentHeight: "h-6",
      translate: "-translate-y-6",
      iconSize: "size-5",
    },
  };

  return sizeMap[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "filled",
      size = "md",
      startIcon,
      endIcon,
      isLoading = false,
      disabled = false,
      fullWidth = false,
      onClick,
      type = "button",
      color = "primary",
      startIconClassname,
      endIconClassname,
      ...props
    },
    ref,
  ) => {
    const { container, contentHeight, translate, iconSize } =
      getSizeClasses(size);
    const StartIcon = startIcon
      ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
      : null;
    const EndIcon = endIcon
      ? (LucideIcons[endIcon] as LucideIcons.LucideIcon)
      : null;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({ size }),
          getColorClasses(variant, color),
          fullWidth ? "w-full" : "",
          className,
        )}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        <div className={cn("overflow-hidden", container)}>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isLoading ? translate : "translate-y-0",
            )}
          >
            <div className={cn("fall", contentHeight)}>
              {StartIcon && (
                <StartIcon
                  className={cn(
                    "mr-1.5",
                    iconSize,
                    variant === "filled" &&
                      (color === "primary" || color === "danger") &&
                      "text-white",
                    startIconClassname,
                  )}
                />
              )}

              {children}
              {EndIcon && (
                <EndIcon className={cn("ml-1.5", iconSize, endIcon)} />
              )}
            </div>

            <div className={cn("fall", contentHeight)}>
              <Spinner className="stroke-nl-600 dark:stroke-nd-200" />
            </div>
          </div>
        </div>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
