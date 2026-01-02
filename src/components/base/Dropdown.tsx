import React, { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/utils/helpers";
import { Label } from "./Label";
import { ErrorText } from "./ErrorText";
import { Icon } from "./Icon";
import { useInfiniteScroll } from "@/hooks/useInfiniteScrolling";

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string | number | (string | number)[] | null;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled";
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
  className?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
  loadMoreText?: string;
  icon?: React.ReactNode;
  noOptionsText?: string;
  maxHeight?: string;
  showClear?: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      labelClassName,
      placeholder = "Select option",
      options = [],
      value,
      onChange,
      onBlur,
      error,
      success = false,
      helperText,
      required = false,
      disabled = false,
      fullWidth = false,
      inputSize = "md",
      containerClassName,
      multiple = false,
      searchable = false,
      searchPlaceholder = "Search...",
      onSearch,
      onLoadMore,
      hasMore = false,
      isLoading = false,
      loadMoreText = "Load more",
      icon,
      noOptionsText = "No options found",
      maxHeight = "300px",
      showClear = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { sentinelRef } = useInfiniteScroll({
      onLoadMore: onLoadMore || (() => {}),
      hasMore,
      isLoading,
    });

    const TEXT_SIZE_MAP = {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-sm",
    };

    const sizeClasses = {
      sm: `${TEXT_SIZE_MAP.sm} py-1.5 px-2.5`,
      md: `${TEXT_SIZE_MAP.md} py-2 px-4`,
      lg: `${TEXT_SIZE_MAP.lg} py-2.5 px-4`,
    };

    const selectedValues = multiple ? (Array.isArray(value) ? value : []) : value != null ? [value] : [];

    const selectedOptionsMap = new Map<any, DropdownOption>();
    options.forEach((opt) => {
      if (selectedValues.includes(opt.value)) {
        selectedOptionsMap.set(opt.value, opt);
      }
    });

    const sortedOptions = [
      ...options.filter((opt) => selectedValues.includes(opt.value)),
      ...options.filter((opt) => !selectedValues.includes(opt.value)),
    ];

    const displayValue = multiple
      ? selectedValues.length > 0
        ? `${selectedValues.length} selected`
        : placeholder
      : selectedOptionsMap.get(value)?.label || placeholder;

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleSelect = (option: DropdownOption) => {
      if (option.disabled) return;

      if (multiple) {
        const currentValue = Array.isArray(value) ? value : [];
        const newValue = currentValue.includes(option.value)
          ? currentValue.filter((v) => v !== option.value)
          : [...currentValue, option.value];
        onChange?.(newValue);
      } else {
        onChange?.(option.value);
        setIsOpen(false);
        onBlur?.();
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : "");
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    };

    const hasSpaceBelow = useMemo(() => {
      if (!isOpen || !dropdownRef.current) return true;

      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const DROPDOWN_HEIGHT = 300; // px (or dynamic)

      return spaceBelow >= DROPDOWN_HEIGHT || spaceBelow >= spaceAbove;
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          onBlur?.();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        searchInputRef.current?.focus();
      }

      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onBlur]);

    const hasValue = multiple ? Array.isArray(value) && value.length > 0 : value != null;
    const labelColorClass = error ? "text-error" : success ? "text-success" : "";
    return (
      <div
        ref={dropdownRef}
        className={cn("space-y-1 flex flex-col relative", fullWidth && "w-full", containerClassName)}
      >
        {label && (
          <Label
            required={required}
            className={cn(
              error ? "text-error" : success ? "text-success" : "",
              labelColorClass,
              labelClassName
            )}
          >
            {label}
          </Label>
        )}

        <div
          onClick={handleToggle}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-lg border transition-all",
            "bg-base-1",
            error && "border-error",
            success && "border-success",
            !error && !success && "border-base-content/40",
            sizeClasses[inputSize],
            disabled && "opacity-50 cursor-not-allowed bg-base-2"
          )}
        >
          <span className={cn("flex-1", TEXT_SIZE_MAP[inputSize], "text-body-content")}>{displayValue}</span>
          <div className="flex items-center gap-2">
            {showClear && hasValue && !disabled && (
              <div onClick={handleClear} className="cursor-pointer">
                <Icon name="X" size={16} className="text-base-content hover:text-error" />
              </div>
            )}
            {icon || (
              <Icon
                name="ChevronDown"
                size={20}
                className={cn("transition-transform text-base-content ml-2", isOpen && "rotate-180")}
              />
            )}
          </div>
        </div>

        {isOpen && (
          <div
            className={cn(
              "absolute z-1001 overflow-hidden border border-base-content/10 w-full min-w-44 p-1.5 rounded-lg shadow-lg bg-base-1",
              hasSpaceBelow ? "top-full mt-1" : "bottom-full -mb-4 "
            )}
            style={{ maxHeight }}
          >
            {searchable && (
              <div className="p-2 border-b border-base-content/40">
                <div className="flex items-center gap-2 px-3 py-2 border border-base-content/40 rounded-lg bg-base-2">
                  <Icon name="Search" size={16} className="text-body-content" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "flex-1 bg-transparent outline-none text-body-content placeholder:text-base-content/30",
                      TEXT_SIZE_MAP[inputSize]
                    )}
                  />
                </div>
              </div>
            )}

            <div
              className={cn("overflow-y-auto flex flex-col gap-1", sortedOptions.length > 7 && "pb-3")} //Hardcoded according to the 300px - change later
              style={{ maxHeight: `calc(${maxHeight} - ${searchable ? "60px" : "0px"})` }}
            >
              {!isLoading && sortedOptions.length === 0 ? (
                <div className={cn("p-4 text-center text-base-content/40", TEXT_SIZE_MAP[inputSize])}>
                  {noOptionsText}
                </div>
              ) : (
                sortedOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer transition-colors",
                        "px-3 py-2 rounded-md",
                        "hover:bg-base-3/80",
                        // index === sortedOptions.length - 1 && "mb-3",
                        isSelected ? "bg-base-2 text-base-content" : "text-body-content",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span
                        className={cn(
                          // isSelected ? "text-base-content" : "text-body-content",
                          TEXT_SIZE_MAP[inputSize]
                        )}
                      >
                        {option.label}
                      </span>
                      {isSelected && <Icon name="Check" size={16} className="text-base-content" />}
                    </div>
                  );
                })
              )}

              {onLoadMore && hasMore && <div ref={sentinelRef} className="h-4" />}

              {isLoading && (
                <div className={cn("p-3 text-center text-base-content/30", TEXT_SIZE_MAP[inputSize])}>
                  Loading...
                </div>
              )}

              {onLoadMore && hasMore && !isLoading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadMore();
                  }}
                  className={cn(
                    "w-full p-2 text-base-content/40 hover:bg-base-2 transition-colors",
                    TEXT_SIZE_MAP[inputSize]
                  )}
                >
                  {loadMoreText}
                </button>
              )}
            </div>
          </div>
        )}

        {(helperText || error) && (
          <ErrorText className={error ? "text-error" : "text-base-content/40"}>
            {error || helperText}
          </ErrorText>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };

export default Dropdown;
