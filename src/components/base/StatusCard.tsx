import { cva } from "class-variance-authority";
import React, { type ReactNode } from "react";
import { cn } from "demaze-ui-lib/utils";
import { Button, ButtonProps } from "./Button";
import { Icon, IconName } from "./Icon";

/**
 * StatusCard variant styles
 * - info: Informational state with primary/purple colors
 * - warning: Warning state with warning colors
 * - error: Error state with error colors
 * - success: Success state with success colors
 * - pending: Pending/waiting state with neutral colors
 */
export type StatusCardVariant = "info" | "warning" | "error" | "success" | "pending";

/**
 * StatusCard size variants
 * - sm: Small (compact spacing)
 * - md: Medium (standard spacing) - Default
 * - lg: Large (generous spacing)
 */
type StatusCardSize = "sm" | "md" | "lg";

/**
 * StatusCard component props interface
 */
export interface StatusCardProps {
  /** Main title/heading text */
  title: string;

  /** Description text below the title */
  description?: string;

  /** Lucide icon name to display */
  icon?: IconName;

  /** Custom icon element (overrides icon prop) */
  customIcon?: ReactNode;

  /** StatusCard variant */
  variant?: StatusCardVariant;

  /** Size of the status card */
  size?: StatusCardSize;

  /** Primary action button props */
  primaryAction?: Omit<ButtonProps, "ref">;

  /** Secondary action button props */
  secondaryAction?: Omit<ButtonProps, "ref">;

  /** Additional CSS classes for the container */
  className?: string;

  /** Additional CSS classes for the card wrapper */
  cardClassName?: string;

  /** Additional CSS classes for the title */
  titleClassName?: string;

  /** Additional CSS classes for the description */
  descriptionClassName?: string;

  /** Additional CSS classes for the icon container */
  iconContainerClassName?: string;

  /** Show or hide the component */
  show?: boolean;

  /** Additional content to render below actions */
  footer?: ReactNode;
}

/**
 * StatusCard container variants using CVA - NO GRADIENT BACKGROUND
 */
const statusCardVariants = cva(
  "flex items-center justify-center w-auto h-auto",
  {
    variants: {
      variant: {
        info: "",
        warning: "",
        error: "",
        success: "",
        pending: "",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

/**
 * Card inner variants
 */
const cardVariants = cva(
  "bg-base-1 rounded-2xl shadow-xl flex flex-col items-center text-center",
  {
    variants: {
      size: {
        sm: "p-8 max-w-md gap-4",
        md: "p-12 max-w-xl gap-6",
        lg: "p-16 max-w-2xl gap-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Get variant-specific color classes
 */
function getVariantClasses(variant: StatusCardVariant = "info") {
  const variants: Record<StatusCardVariant, {
    iconOuter: string;
    iconInner: string;
    iconColor: string;
    title: string;
    description: string;
  }> = {
    info: {
      iconOuter: "bg-primary-100 border-primary-200",
      iconInner: "bg-primary-600",
      iconColor: "text-white",
      title: "text-base-content",
      description: "text-body-content",
    },
    warning: {
      iconOuter: "bg-warning-content border-warning",
      iconInner: "bg-warning",
      iconColor: "text-white",
      title: "text-base-content",
      description: "text-body-content",
    },
    error: {
      iconOuter: "bg-error-content border-error",
      iconInner: "bg-error",
      iconColor: "text-white",
      title: "text-base-content",
      description: "text-body-content",
    },
    success: {
      iconOuter: "bg-success-content border-success",
      iconInner: "bg-success",
      iconColor: "text-white",
      title: "text-base-content",
      description: "text-body-content",
    },
    pending: {
      iconOuter: "bg-secondary-100 border-secondary-200",
      iconInner: "bg-secondary-600",
      iconColor: "text-white",
      title: "text-base-content",
      description: "text-body-content",
    },
  };

  return variants[variant];
}

/**
 * Get size-specific classes for text and icon
 */
const getSizeClasses = (size: StatusCardSize = "md") => {
  const sizeMap = {
    sm: {
      iconOuter: "w-20 h-20",
      iconInner: "w-14 h-14",
      iconSize: "md" as const,
      title: "text-2xl font-bold",
      description: "text-base",
      buttonSize: "md" as const,
    },
    md: {
      iconOuter: "w-28 h-28",
      iconInner: "w-20 h-20",
      iconSize: "lg" as const,
      title: "text-3xl font-bold",
      description: "text-lg",
      buttonSize: "lg" as const,
    },
    lg: {
      iconOuter: "w-36 h-36",
      iconInner: "w-24 h-24",
      iconSize: "xl" as const,
      title: "text-4xl font-bold",
      description: "text-xl",
      buttonSize: "xl" as const,
    },
  };

  return sizeMap[size];
};

/**
 * StatusCard Component
 */
export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  description,
  icon = "AlertCircle",
  customIcon,
  variant = "info",
  size = "md",
  primaryAction,
  secondaryAction,
  className,
  cardClassName,
  titleClassName,
  descriptionClassName,
  iconContainerClassName,
  show = true,
  footer,
}) => {
  if (!show) return null;

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  // Icon element with proper styling
  const iconElement = customIcon || (icon && <Icon name={icon as IconName} size={sizeClasses.iconSize} className="text-base-1" />);

  return (
    <div className={cn(statusCardVariants({ variant }), className)}>
      <div className={cn(cardVariants({ size }), cardClassName)}>
        {/* Layered Icon */}
        {iconElement && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full border-4 transition-transform hover:scale-105",
              sizeClasses.iconOuter,
              variantClasses.iconOuter,
              iconContainerClassName
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                sizeClasses.iconInner,
                variantClasses.iconInner,
                variantClasses.iconColor
              )}
            >
              {iconElement}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3 max-w-lg">
          {/* Title */}
          <h2 className={cn(sizeClasses.title, variantClasses.title, titleClassName)}>
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className={cn(sizeClasses.description, variantClasses.description, descriptionClassName)}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2">
            {primaryAction && (
              <Button
                size={sizeClasses.buttonSize}
                variant="filled"
                color="primary"
                {...primaryAction}
              />
            )}
            {secondaryAction && (
              <Button
                size={sizeClasses.buttonSize}
                variant="outline"
                color="neutral"
                {...secondaryAction}
              />
            )}
          </div>
        )}

        {/* Footer */}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

StatusCard.displayName = "StatusCard";

export { statusCardVariants, cardVariants, getVariantClasses };
export type { StatusCardSize };