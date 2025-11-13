import React from "react";
import Select from "../base/Select";
import type { CustomSelectProps, SelectOption } from "../base/Select";
import Chip from "../base/Chip";

type MultiSelectWithChipsProps = Pick<
  CustomSelectProps,
  "components" | "onInputChange" | "error" | "onMenuScrollToBottom"
> & {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
};

export const MultiSelectWithChips: React.FC<MultiSelectWithChipsProps> = (
  props,
) => {
  const {
    options,
    value,
    onChange,
    placeholder,
    isLoading = false,
    error = "",
    label = "",
    onInputChange,
    components,
    ...rest
  } = props;
  const handleChange = (
    newValue: SelectOption | readonly SelectOption[] | null,
  ) => {
    if (Array.isArray(newValue)) {
      onChange([...newValue]);
    } else {
      onChange([]);
    }
  };

  return (
    <div className="w-full">
      <Select
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        menuPortalTarget={document.body}
        hideInputValues={true}
        placeholder={placeholder}
        isLoading={isLoading}
        error={error}
        onInputChange={onInputChange}
        components={components}
        label={label}
        {...rest}
      />
      <div className="mt-2 flex flex-wrap gap-1">
        {value?.map((item, index) => (
          <Chip
            key={index}
            label={item.label}
            isCollapsible
            onCollapse={() =>
              onChange(value.filter((v) => v.value !== item.value))
            }
          />
        ))}
      </div>
    </div>
  );
};
