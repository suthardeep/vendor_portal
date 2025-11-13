import { cn } from "@/utils/helpers";
import { Check, ChevronDown, X } from "lucide-react";
import React, { useMemo, type JSX } from "react";
import type {
  GroupBase,
  MultiValue,
  Props as ReactSelectProps,
  SingleValue,
  ValueContainerProps,
} from "react-select";
import ReactSelect, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import Checkbox from "./Checkbox";
import ErrorText from "./ErrorText";
import Label from "./Label";
import Spinner from "../compound/spinner/Spinner";

function CustomSelectInner<T = string>(
  props: CustomSelectProps<T>,
  ref: React.Ref<any>,
) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    isSearchable = true,
    isClearable = false,
    hideInputValues = false,
    isMulti,
    isDisabled = false,
    isLoading = false,
    className,
    wrapperClassName,
    classNamePrefix = "react-select",
    placeholder = "Select...",
    noOptionsMessage = ({ inputValue }: any) =>
      inputValue
        ? `No options found for "${inputValue}"`
        : "No options available",
    loadingMessage = () => (
      <div className="fall p-2">
        <Spinner />
      </div>
    ),
    error = "",
    helperText,
    label,
    required = false,
    variant = "default",
    width = 180,
    isCreatable = false,
    components: overrideComponents,
    ...restProps
  } = props;

  const customComponents = useMemo(
    () => ({
      DropdownIndicator,
      ClearIndicator,
      Option,
      ValueContainer: (props: any) => (
        <ValueContainer {...props} hideInputValues={hideInputValues} />
      ),
      MultiValue,
      MultiValueLabel,
      MultiValueRemove,
      ...overrideComponents,
    }),
    [overrideComponents],
  );

  const SelectComponent = isCreatable ? CreatableSelect : ReactSelect;

  return (
    <div
      className={(cn("custom-select-wrapper"), wrapperClassName)}
      style={{ minWidth: `${width}px` }}
    >
      {label && (
        <Label required={required} className="mb-1">
          {label}
        </Label>
      )}
      <SelectComponent
        ref={ref}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
        isDisabled={isDisabled}
        unstyled
        isLoading={isLoading}
        className={className}
        classNamePrefix={classNamePrefix}
        styles={{
          option: () => ({ cursor: "pointer" }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
        components={{
          ...customComponents,
          LoadingIndicator: () => (
            <div>
              <Spinner />
            </div>
          ),
        }}
        classNames={{
          control: ({ isFocused }: any) =>
            cn(
              variant === "minimal"
                ? minimalControlClasses.base
                : controlClasses.base,
              variant === "default" && isFocused && controlClasses.focus,
            ),
          menu: () => menuStyles,
          singleValue: () => singleValueStyles,
          placeholder: () => placeholderStyles,
          noOptionsMessage: () => noOptionsStyles,
          option: ({ isFocused, isSelected }: any) =>
            cn(
              isFocused && optionStyles.focus,
              isSelected && optionStyles.selected,
              optionStyles.base,
            ),
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          input: () => inputStyles,
        }}
        hideSelectedOptions={false}
        closeMenuOnSelect={!isMulti}
        menuPortalTarget={document.body}
        menuPlacement="auto"
        {...restProps}
      />
      {(helperText || error) && (
        <ErrorText
          className={
            error
              ? "text-dl-500 dark:text-dd-500"
              : "text-nl-500 dark:text-nd-300"
          }
        >
          {error || helperText}
        </ErrorText>
      )}
    </div>
  );
}

const controlClasses = {
  base: "border border-nl-200 dark:border-nd-500 bg-white dark:bg-nd-800 rounded-lg py-2 px-3 text-sm",
  focus: "focus-within:border-nl-400 dark:focus-within:border-nd-300",
};

const minimalControlClasses = {
  base: "bg-transparent border-0 shadow-none p-0 m-0 !min-h-8 h-auto text-sm",
};

const noOptionsStyles = `text-nl-600 dark:text-nd-200 text-sm p-1.5`;
const menuStyles =
  "p-1.5 my-1.5 border border-nl-200 dark:border-nd-500 bg-white dark:bg-nd-700 rounded-lg shadow-xs min-w-fit";
const placeholderStyles = "text-nl-600 dark:text-nd-300";
const optionStyles = {
  base: "py-2 px-3 [&>*]:!text-sm text-nl-600 dark:text-nd-200 font-medium rounded text-nowrap mt-0.5",
  focus: "bg-nl-50 dark:bg-nd-500 !active:bg-nl-200",
  selected: "!text-nl-900 dark:!text-nd-50 bg-pl-100/30 dark:bg-pd-500/20",
};
const singleValueStyles = "text-nl-800 dark:text-nd-100";
const multiValueLabelStyles = "text-xs";
const multiValueRemoveStyles =
  "text-nl-500 hover:text-red-800 hover:border-red-300 rounded-md";
const inputStyles =
  "text-sm text-nl-800 dark:text-nd-100 placeholder:text-gray-400";

export const Select = React.forwardRef(CustomSelectInner) as <
  T = string,
  M = unknown,
>(
  props: CustomSelectProps<T, M> & { ref?: React.Ref<any> },
) => JSX.Element;

const ValueContainer = (props: CustomValueContainerProps) => {
  const { children, getValue, isMulti, hideInputValues } = props;
  if (isMulti && !hideInputValues) {
    const values = getValue();
    const displayValue =
      values.length > 0
        ? values.map((option: SelectOption) => option.label).join(", ")
        : "";
    return (
      <components.ValueContainer {...props} className={cn("m-0 p-0")}>
        {displayValue && (
          <div className="text-nl-800 dark:text-nd-100 truncate px-1 text-sm">
            {displayValue}
          </div>
        )}
        {children}
      </components.ValueContainer>
    );
  }

  return (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  );
};

const Option = (props: any) => {
  const { isMulti, isSelected, label } = props;
  return (
    <components.Option
      {...props}
      className="!flex items-center justify-between"
    >
      <span className="flex-1">{label}</span>
      {isMulti ? (
        <Checkbox
          checked={isSelected}
          onChange={() => {}}
          className="pointer-events-none ml-2"
          size="sm"
        />
      ) : (
        <>{isSelected && <Check size={16} className="ml-2" />}</>
      )}
    </components.Option>
  );
};

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown
      className="text-nl-400 hover:text-nl-600 dark:text-nd-300 hover:dark:text-nd-200"
      size={20}
    />
  </components.DropdownIndicator>
);

const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <X
      className="text-nl-400 hover:text-nl-600 dark:text-nd-300 hover:dark:text-nd-200"
      size={16}
    />
  </components.ClearIndicator>
);

const MultiValue = () => null;
const MultiValueLabel = () => null;
const MultiValueRemove = () => null;

export interface SelectOption<T = string, M = unknown> {
  label: string;
  value: T;
  isDisabled?: boolean;
  __isNew__?: boolean;
  custom?: M;
}

export type CustomSelectProps<T = string, M = unknown> = Omit<
  ReactSelectProps<SelectOption<T>>,
  "onChange"
> & {
  options: SelectOption<T, M>[];
  value?: SelectOption<T, M> | readonly SelectOption<T, M>[] | null;
  defaultValue?: SelectOption<T, M> | readonly SelectOption<T, M>[] | null;
  onChange?: (value: SelectOnChangeVal<T, M>) => void;
  label?: string;
  required?: boolean;
  variant?: "default" | "minimal";
  width?: number;
  error?: string;
  wrapperClassName?: string;
  helperText?: string;
  hideInputValues?: boolean;
  isCreatable?: boolean;
};

export type SelectOnChangeVal<T = string, M = unknown> =
  | SingleValue<SelectOption<T, M>>
  | MultiValue<SelectOption<T, M>>
  | null;

export function SingleSelect<T = string, M = unknown>(
  props: Omit<CustomSelectProps<T, M>, "isMulti">,
) {
  return <Select<T, M> {...props} isMulti={false} />;
}

export function MultiSelect<T = string, M = unknown>(
  props: Omit<CustomSelectProps<T, M>, "isMulti">,
) {
  return <Select<T, M> {...props} isMulti={true} />;
}

export function findOptionByValue<T extends string | number>(
  options: SelectOption<T>[],
  value: T,
): SelectOption<T> | undefined {
  return options.find((opt) => opt.value === value);
}

export default Select;

type CustomValueContainerProps = ValueContainerProps<
  SelectOption,
  true,
  GroupBase<SelectOption>
> & {
  hideInputValues?: boolean;
};
