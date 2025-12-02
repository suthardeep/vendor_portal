// src/components/controlled-form-components/index.tsx

import { FieldValues, Controller, FieldPath, PathValue } from 'react-hook-form';
import { Input, InputProps } from '@/components/base/Input';
import { Checkbox, CheckboxProps } from '@/components/base/Checkbox';
import { RadioGroup, RadioGroupProps } from '@/components/base/RadioGroup';
import { FileUploadField, FileUploadFieldProps } from '@/components/base/FileUploadField';
import { MobileNumberInput, MobileNumberInputProps } from '@/components/base/MobileNumberInput';
import { Dropdown, DropdownProps } from '@/components/base/Dropdown';

// --- Types Helper
type ControlledProps<TFieldValues extends FieldValues, TProps> = TProps & {
  name: FieldPath<TFieldValues>;
};

// --- Controlled Input
export function ControlledInput<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, InputProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...props}
          {...field}
          value={field.value ?? ''} // Handle undefined/null
          error={error?.message}
        />
      )}
    />
  );
}

// --- Controlled MobileNumberInput
export function ControlledMobileNumberInput<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, MobileNumberInputProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => (
        <MobileNumberInput
          {...props}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

// --- Controlled Checkbox
export function ControlledCheckbox<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, CheckboxProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => (
        <Checkbox
          {...props}
          checked={!!field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

// --- Controlled RadioGroup
export function ControlledRadioGroup<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, RadioGroupProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => (
        <RadioGroup
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur} // RadioGroup might not utilize onBlur, but good to pass if added later
          error={error?.message}
        />
      )}
    />
  );
}

// --- Controlled Dropdown
export function ControlledDropdown<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, DropdownProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => (
        <Dropdown
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

// --- Controlled FileUpload
// Smart wrapper: Handles both Single File (File | null) and Multiple Files (File[]) 
// based on the `multiple` prop matching your Zod schema expectations.
export function ControlledFileUpload<TFieldValues extends FieldValues>(
  props: ControlledProps<TFieldValues, FileUploadFieldProps>
) {
  return (
    <Controller<TFieldValues>
      name={props.name}
      render={({ field, fieldState: { error } }) => {
        // Normalize value for the component (Always expects File[])
        const componentValue = Array.isArray(field.value)
          ? field.value
          : field.value
            ? [field.value]
            : [];

        return (
          <FileUploadField
            {...props}
            value={componentValue}
            onBlur={field.onBlur}
            error={error?.message}
            onChange={(files) => {
              if (props.multiple) {
                // If multiple is allowed, pass the full array
                field.onChange(files);
              } else {
                // If single, extract the first file or null
                field.onChange(files.length > 0 ? files[0] : null);
              }
            }}
          />
        );
      }}
    />
  );
}