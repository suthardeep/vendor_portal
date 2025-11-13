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
            "min-h-[80px] w-full resize-y rounded-lg px-3 py-2 text-sm transition-colors outline-none",
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
              error ? "text-dl-500 dark:text-dd-500" : textClasses.muted
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
  default: "border-nl-200 dark:border-nd-500",
  hover: `hover:border-nl-300 dark:hover:border-nd-400`,
  focus:
    "focus-within:border-nl-400 dark:focus-within:border-nd-300 hover:focus-within:border-nl-400 dark:hover:focus-within:border-nd-300",
};

const dangerBorderClasses =
  "border-dl-500 hover:border-dl-400 dark:border-dd-500 hover:dark:border-dd-400 focus-within:border-danger-500";

const textClasses = {
  primary: "text-nl-800 dark:text-nd-100",
  secondary: "text-nl-700 dark:text-nd-200",
  muted: "text-nl-500 dark:text-nd-300",
  placeholder: "placeholder:text-nl-400 dark:placeholder:text-nd-400",
};

const backgroundClasses = {
  primary: "bg-white dark:bg-nd-800",
  secondary: "bg-nl-50 dark:bg-nd-700/50",
  transparent: "bg-transparent",
};

const disabledClasses =
  "disabled:bg-nl-100 dark:disabled:bg-nd-700 disabled:text-nl-400 dark:disabled:text-nd-500 disabled:cursor-not-allowed";
