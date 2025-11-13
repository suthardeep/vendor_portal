import React from "react";
import Switch from "@/components/base/Switch";
import Checkbox from "@/components/base/Checkbox";
import Label from "@/components/base/Label";
import ErrorText from "@/components/base/ErrorText";
import { cn } from "@/utils/helpers";

export type BooleanInputType = "switch" | "checkbox";

interface BooleanInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  type?: BooleanInputType;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  description?: string;
}

const BooleanInput: React.FC<BooleanInputProps> = (props) => {
  const {
    label,
    helperText,
    error,
    checked,
    onChange,
    type = "switch",
    size = "md",
    loading = false,
    disabled = false,
    required = false,
    className,
    wrapperClassName,
    description,
  } = props;

  const hasError = !!error;

  const renderControl = () => {
    if (type === "checkbox") {
      return (
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size={size}
          disabled={disabled || loading}
          error={error}
          className={className}
        />
      );
    }

    return (
      <Switch
        checked={checked}
        setChecked={onChange}
        size={size}
        loading={loading}
      />
    );
  };

  // If type is checkbox and label is provided, let Checkbox handle the label internally
  if (type === "checkbox" && label) {
    return (
      <div className={cn("space-y-1", wrapperClassName)}>
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size={size}
          disabled={disabled || loading}
          error={error}
          label={label}
          helperText={helperText}
          description={description}
          className={className}
        />
      </div>
    );
  }

  // For switch or checkbox without label, render custom layout
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label required={required}>{label}</Label>
          {renderControl()}
        </div>
      )}

      {!label && renderControl()}

      {description && !hasError && (
        <p className="text-nl-500 dark:text-nd-400 text-xs">{description}</p>
      )}

      {helperText && !hasError && (
        <p className="text-nl-600 dark:text-nd-300 text-xs">{helperText}</p>
      )}

      {hasError && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default BooleanInput;
