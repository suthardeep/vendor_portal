import React from "react";
import { InputCellConfig } from "../table.types";

interface InputCellProps extends InputCellConfig {
  row: any;
  valueKey: string;
}

export const InputCell: React.FC<InputCellProps> = ({
  row,
  valueKey,
  type = "text",
  placeholder,
  onChange,
  disabled = false,
}) => {
  const [value, setValue] = React.useState(row[valueKey] || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue, row);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-20 px-2 py-1 text-sm border border-base-content/20 rounded  outline-none disabled:bg-base-2 disabled:cursor-not-allowed"
    />
  );
};