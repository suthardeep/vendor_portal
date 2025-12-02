import { cva } from "class-variance-authority";
import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
// import { cn } from "../../utils/helpers";
import { cn } from "demaze-ui-lib/utils";
import Spinner from "../compound/spinner/Spinner";
import { Icon,IconName } from "./Icon";

/**
 * Button variant styles
 * - filled: Solid background with primary color
 * - outline: Border only with transparent background
 * - ghost: No border, transparent background
 * - link: Text-only with underline on hover
 * - text: Plain text style
 */
export type ButtonVariant = "filled" | "outline" | "ghost" | "link" | "text";

/**
 * Button size variants
 * - xs: Extra small (text-xs, compact padding)
 * - sm: Small (text-xs, minimal padding)
 * - md: Medium (text-sm, standard padding) - Default
 * - lg: Large (text-base, generous padding)
 * - xl: Extra large (text-lg, maximum padding)
 */
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Button color themes
 * Uses preconfigured Tailwind classes with primary/secondary/neutral colors
 */
type ButtonColor = "primary" | "neutral" | "success" | "danger";

/**
 * Animation types for button interactions
 */
type AnimationType = "none" | "fade" | "scale" | "slide" | "bounce";

/**
 * HTML button types
 */
type ButtonType = "button" | "submit" | "reset";

/**
 * Button component props interface
 * Extends native HTML button attributes
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  /** Content to display inside the button */
  children?: ReactNode;

  /** Additional CSS classes for the button container */
  className?: string;

  /** Additional CSS classes for button text/content */
  buttonTextClass?: string;

  /** Button variant style */
  variant?: ButtonVariant;

  /** Size of the button */
  size?: ButtonSize;

  /** Lucide icon name to display at the start of the button */
  startIcon?: IconName;

  /** Lucide icon name to display at the end of the button */
  endIcon?: IconName;

  /** Additional CSS classes for the start icon */
  startIconClassname?: string;

  /** Additional CSS classes for the end icon */
  endIconClassname?: string;

  /** Is the button in a loading state */
  isLoading?: boolean;

  /** Text to display when the button is in a loading state  */
  loadingText?: string;

  /** Is the button disabled */
  disabled?: boolean;

  /** Display as full width button */
  fullWidth?: boolean;

  /** Function called when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /** HTML button type (when as="button") */
  type?: ButtonType;

  /** Button color theme */
  color?: ButtonColor;

  /** Animation type for button interactions */
  animation?: AnimationType;

  /** Render as button or anchor link */
  as?: "button" | "link";

  /** Link URL (when as="link") */
  href?: string;

  /** Link target (when as="link") */
  target?: string;

  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * Button variants using class-variance-authority (CVA)
 * CVA is used here to manage complex variant combinations efficiently
 * It provides type-safe variant props and automatic class merging
 */
const buttonVariants = cva(
  // Base classes applied to all button variants
  "inline-flex items-center text-nowrap justify-center cursor-pointer font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 transition-all disabled:cursor-not-allowed relative overflow-hidden",
  {
    variants: {
      size: {
        xs: "text-xs px-2 py-1 rounded-md",
        sm: "text-xs px-2 py-1.5 rounded-md",
        md: "text-sm font-medium px-3 py-2 rounded-lg",
        lg: "text-base px-4 py-2 rounded-lg",
        xl: "text-lg px-5 py-2.5 rounded-lg",
      },
      animation: {
        none: "",
        fade: "transition-opacity hover:opacity-90",
        scale: "transition-transform hover:scale-105 active:scale-95",
        slide: "transition-transform hover:-translate-y-0.5",
        bounce: "hover:animate-bounce",
      },
    },
    defaultVariants: {
      size: "md",
      animation: "none",
    },
  }
);

/**
 * Get size-specific classes for loading animation and icons
 * Returns container heights, translations, and icon sizes based on button size
 */
const getSizeClasses = (size: ButtonSize = "md") => {
  const sizeMap = {
    xs: {
      container: "max-h-3.5",
      contentHeight: "h-3.5",
      translate: "-translate-y-3.5",
    },
    sm: {
      container: "max-h-4",
      contentHeight: "h-4",
      translate: "-translate-y-4",
    },
    md: {
      container: "max-h-5",
      contentHeight: "h-5",
      translate: "-translate-y-5",
    },
    lg: {
      container: "max-h-6",
      contentHeight: "h-6",
      translate: "-translate-y-6",
    },
    xl: {
      container: "max-h-7",
      contentHeight: "h-7",
      translate: "-translate-y-7",
    },
  };

  return sizeMap[size];
};

/**
 * Get color classes based on variant and color theme
 * Uses object lookup for Tailwind class generation compatibility
 * Tailwind cannot generate dynamic classes at runtime, so all classes must be predefined
 */
function getColorClasses(variant: ButtonVariant = "filled", color: ButtonColor = "primary"): string {
  // Object lookup ensures all Tailwind classes are statically analyzable
  const themes: Record<ButtonColor, Record<ButtonVariant, string>> = {
    primary: {
      filled:
        "bg-primary hover:bg-primary/90 active:bg-primary text-primary-content focus-visible:ring-primary/50",
      outline:
        "border border-primary text-primary hover:bg-primary/10 active:bg-primary/20 focus-visible:ring-primary/30",
      ghost: "text-primary hover:bg-primary/10 active:bg-primary/20 focus-visible:ring-primary/30",
      link: "text-primary hover:underline focus-visible:ring-primary/30 py-0",
      text: "text-primary hover:text-primary/80 focus-visible:ring-primary/30",
    },
    neutral: {
      filled:
        "bg-neutral hover:bg-neutral/90 active:bg-neutral text-neutral-content focus-visible:ring-neutral/50",
      outline:
        "border border-neutral text-neutral hover:bg-neutral/10 active:bg-neutral/20 focus-visible:ring-neutral/30",
      ghost: "text-neutral hover:bg-neutral/10 active:bg-neutral/20 focus-visible:ring-neutral/30",
      link: "text-neutral hover:underline focus-visible:ring-neutral/30 py-0",
      text: "text-neutral hover:text-neutral/80 focus-visible:ring-neutral/30",
    },
    success: {
      filled:
        "bg-secondary hover:bg-secondary/90 active:bg-secondary text-secondary-content focus-visible:ring-secondary/50",
      outline:
        "border border-secondary text-secondary hover:bg-secondary/10 active:bg-secondary/20 focus-visible:ring-secondary/30",
      ghost: "text-secondary hover:bg-secondary/10 active:bg-secondary/20 focus-visible:ring-secondary/30",
      link: "text-secondary hover:underline focus-visible:ring-secondary/30 py-0",
      text: "text-secondary hover:text-secondary/80 focus-visible:ring-secondary/30",
    },
    danger: {
      filled: "bg-error hover:bg-error/90 active:bg-error text-error-content focus-visible:ring-error/50",
      outline:
        "border border-error text-error hover:bg-error/10 active:bg-error/20 focus-visible:ring-error/30",
      ghost: "text-error hover:bg-error/10 active:bg-error/20 focus-visible:ring-error/30",
      link: "text-error hover:underline focus-visible:ring-error/30 py-0",
      text: "text-error hover:text-error/80 focus-visible:ring-error/30",
    },
  };

  return themes[color]?.[variant] ?? "";
}

/**
 * Dynamic Button Component
 *
 * A fully-featured, responsive button component with:
 * - Multiple variants (filled, outline, ghost, link, text)
 * - Multiple sizes (xs to xl)
 * - Loading states with spinner animation
 * - Icon support (Lucide icons or custom React nodes)
 * - Color themes (primary, neutral, success, danger)
 * - Animation options
 * - Can render as button or anchor link
 * - Full accessibility support
 * - Responsive design with mobile-friendly spacing
 *
 * @example
 * // Basic usage
 * <Button onClick={() => console.log('Clicked!')}>Click Me</Button>
 *
 * @example
 * // With loading state and icon
 * <Button isLoading startIcon={<SaveIcon />} variant="filled" color="primary">
 *   Save Changes
 * </Button>
 *
 * @example
 * // As a link with animation
 * <Button as="link" href="https://example.com" target="_blank" animation="scale">
 *   Visit Site
 * </Button>
 *
 * @example
 * // Outline variant with custom icons
 * <Button variant="outline" leftIcon={<CustomIcon />} rightIcon={<ArrowIcon />}>
 *   Custom Button
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      className,
      buttonTextClass,
      variant = "filled",
      size = "md",
      startIcon,
      endIcon,
      isLoading = false,
      loadingText,
      disabled = false,
      fullWidth = false,
      onClick,
      type = "button",
      color = "primary",
      animation = "none",
      startIconClassname = "text-primary-content",
      endIconClassname = "text-primary-content",
      as = "button",
      href = "",
      target = "",
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Get size-specific classes for loading animation
    const { container, contentHeight, translate } = getSizeClasses(size);

    // Determine which icons to use
    const startIconElement = (startIcon) ? (
      <span className={cn("mr-1.5 shrink-0 md:mr-2")}>
        <Icon name={startIcon} className={startIconClassname} size={size} />
      </span>
    ) : null;

    const endIconElement = (endIcon) ? (
      <span className={cn("ml-1.5 shrink-0 md:ml-2")}>
        <Icon name={endIcon} className={endIconClassname} size={size} />
      </span>
    ) : null;

    // Combine all classes using cn (tailwind-merge + clsx)
    // cn() is used throughout to properly merge Tailwind classes and handle conflicts
    const buttonClasses = cn(
      buttonVariants({ size, animation }),
      getColorClasses(variant, color),
      fullWidth ? "w-full" : "",
      className
    );

    // Content wrapper for loading animation
    const buttonContent = (
      <div className={cn("overflow-hidden", container)}>
        <div
          className={cn("transition-all duration-300 ease-in-out", isLoading ? translate : "translate-y-0")}
        >
          {/* Main content */}
          <div className={cn("flex items-center justify-center", contentHeight, buttonTextClass)}>
            {startIconElement}
            {isLoading ? loadingText || children : children}
            {endIconElement}
          </div>

          {/* Loading spinner */}
          <div className={cn("flex items-center justify-center", contentHeight)}>
            {loadingText && <span className="mr-2">{loadingText}</span>}
            <Spinner className="stroke-current" />
          </div>
        </div>
      </div>
    );

    // Render as anchor link
    if (as === "link") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          className={buttonClasses}
          aria-label={ariaLabel}
          aria-disabled={disabled || isLoading}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          onClick={onClick as any}
        >
          {buttonContent}
        </a>
      );
    }

    // Render as button (default)
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={buttonClasses}
        disabled={disabled || isLoading}
        onClick={onClick as any}
        aria-label={ariaLabel}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants, getColorClasses };
export type { ButtonSize, ButtonColor, AnimationType, ButtonType };
