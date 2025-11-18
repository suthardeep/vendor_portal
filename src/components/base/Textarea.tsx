import { cn } from "@/utils/helpers";
import { forwardRef, type TextareaHTMLAttributes } from "react";
import ErrorText from "./ErrorText";
import Label from "./Label";

type TextareaHTMLAttributesWithoutConflicts = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
>;

export interface TextareaProps extends TextareaHTMLAttributesWithoutConflicts {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  variant?: "outlined" | "filled" | "transparent";
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
}

export type TextareaRef = HTMLTextAreaElement;

const Textarea = forwardRef<TextareaRef, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      required = false,
      fullWidth = false,
      variant = "filled",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const getVariantClasses = () => {
      const baseClasses = "border transition-all duration-200 ease-in-out";

      switch (variant) {
        case "outlined":
          return cn(
            baseClasses,
            backgroundClasses.secondary,
            error
              ? dangerBorderClasses
              : cn(
                  borderClasses.default,
                  borderClasses.hover,
                  borderClasses.focus,
                ),
          );
        case "filled":
          return cn(
            baseClasses,
            backgroundClasses.primary,
            error
              ? dangerBorderClasses
              : cn(
                  borderClasses.default,
                  borderClasses.hover,
                  borderClasses.focus,
                ),
          );
        case "transparent":
          return cn(
            baseClasses,
            backgroundClasses.transparent,
            "border-transparent",
            error
              ? dangerBorderClasses
              : cn(borderClasses.hover, borderClasses.focus),
          );
        default:
          return baseClasses;
      }
    };

    return (
      <div className={cn(fullWidth && "w-full", containerClassName)}>
        {label && (
          <Label required={required} className="mb-1">
            {" "}
            {label}{" "}
          </Label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "min-h-20 w-full resize-y rounded-lg px-3 py-2 text-sm transition-colors outline-none",
            textClasses.primary,
            textClasses.placeholder,
            disabledClasses,
            getVariantClasses(),
            className,
          )}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {(helperText || error) && (
          <ErrorText
            className={
              error ? "text-base-content dark:text-neutral-500" : textClasses.muted
            }
          >
            {error || helperText}
          </ErrorText>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;

const borderClasses = {
  default: "border-input-border dark:border-base-3",
  hover: `hover:border-input-border dark:hover:border-base-2`,
  focus:
    "focus-within:border-input-border dark:focus-within:border-base-2 hover:focus-within:border-input-border dark:hover:focus-within:border-base-2",
};

const dangerBorderClasses =
  "border-error dark:border-neutral-500 hover:dark:border-neutral-400 focus-within:border-error";

const textClasses = {
  primary: "text-base-content dark:text-neutral-content",
  secondary: "text-base-3 dark:text-neutral-content",
  muted: "text-disabled-content dark:text-base-2",
  placeholder: "placeholder:text-disabled-content dark:placeholder:text-base-2",
};

const backgroundClasses = {
  primary: "bg-white dark:bg-neutral",
  secondary: "bg-base-200 dark:bg-base-3/50",
  transparent: "bg-transparent",
};

const disabledClasses =
  "disabled:bg-neutral-content dark:disabled:bg-base-3 disabled:text-disabled-content dark:disabled:text-base-3 disabled:cursor-not-allowed";
