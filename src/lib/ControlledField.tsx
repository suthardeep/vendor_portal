// src/components/rhf-fields/ControlledField.tsx

import { ElementType } from 'react';
import { Controller, FieldValues, useFormContext, FieldPath } from 'react-hook-form';

// The base props for RHF connection
type RHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>; // The correct generic path type
  component: ElementType;
  fallbackValue?: any;
}

// All remaining props are passed to the component
type ControlledFieldProps<TFieldValues extends FieldValues> = RHFProps<TFieldValues> & Record<string, any>;

/**
 * Generic RHF wrapper using the Controller.
 */
export function ControlledField<TFieldValues extends FieldValues>({
  name,
  component: Component,
  fallbackValue,
  ...restProps
}: ControlledFieldProps<TFieldValues>) {
  
  // Use FormContext to get the control object without prop drilling
  const { control, formState: { errors } } = useFormContext<TFieldValues>();

  const error = errors[name as string]?.message;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Handle null/undefined values from RHF to component-friendly defaults
        const currentValue = field.value === null || field.value === undefined 
            ? fallbackValue 
            : field.value;

        return (
          <Component 
            {...restProps}
            {...field} // Spreads RHF props: name, value, onChange, onBlur, ref
            value={currentValue}
            error={error} // Pass Zod error message
          />
        );
      }}
    />
  );
}