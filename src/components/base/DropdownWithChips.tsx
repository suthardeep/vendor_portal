import React, { forwardRef, useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers";
import { Label } from "./Label";
import { ErrorText } from "./ErrorText";
import { Icon, IconName } from "./Icon";
import { useInfiniteScroll } from "@/hooks/useInfiniteScrolling";

export interface DropdownWithChipsProps {
  // Label & Helper
  label?: string;
  labelClassName?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  tooltip?: string | React.ReactNode;
  tooltipIcon?: IconName;

  // Input
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  inputSize?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled";
  containerClassName?: string;
  className?: string;

  // Values - ONLY ACCEPTS STRING ARRAYS
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  maxChips?: number;
  chipClassName?: string;
  chipSize?: "sm" | "md" | "lg";
  showChipRemove?: boolean;
  
  // Dropdown Options - Can be string[] or object[]
  options?: any[];
  onSearch?: (query: string) => void | Promise<void>;
  searchPlaceholder?: string;
  noOptionsText?: string;
  maxHeight?: string;
  
  // API Integration (OPTIONAL)
  fetchOptions?: (query: string) => Promise<any[]>;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoading?: boolean;
  loadMoreText?: string;
  debounceTime?: number;

  // Data transformation for objects
  labelAccessor?: string; // e.g., "name", "label", "title"
  valueAccessor?: string; // e.g., "id", "value", "key"
  transformItems?: (items: any[]) => string[]; // Custom transformation function

  // Display customization
  renderChip?: (value: string, onRemove: () => void) => React.ReactNode;
  renderOption?: (value: string, isSelected: boolean) => React.ReactNode;
  
  // Behavior
  allowDuplicates?: boolean;
  allowCustomInput?: boolean; // Allow adding custom tags by pressing Enter
  clearOnSelect?: boolean;
  closeOnSelect?: boolean;
  autoFocus?: boolean;
  name?: string;
  
  // Advanced
  filterOptions?: (options: string[], query: string) => string[];
  onChipRemove?: (value: string) => void;
  onChipAdd?: (value: string) => void;
}

const DropdownWithChips = forwardRef<HTMLDivElement, DropdownWithChipsProps>(({
  label,
  labelClassName,
  placeholder = "Type to search...",
  helperText,
  error,
  success = false,
  required = false,
  tooltip,
  tooltipIcon,
  disabled = false,
  fullWidth = false,
  inputSize = "md",
  variant = "filled",
  containerClassName,
  className,
  
  value = [],
  onChange,
  onBlur,
  maxChips,
  chipClassName,
  chipSize,
  showChipRemove = true,
  
  options,
  onSearch,
  searchPlaceholder = "Search...",
  noOptionsText = "No options found",
  maxHeight = "300px",
  
  fetchOptions,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  loadMoreText = "Load more...",
  debounceTime = 300,
  
  labelAccessor = "name",
  valueAccessor = "id",
  transformItems,
  
  renderChip,
  renderOption,
  
  allowDuplicates = false,
  allowCustomInput = true,
  clearOnSelect = false,
  closeOnSelect = false,
  autoFocus = false,
  name,
  
  filterOptions,
  onChipRemove,
  onChipAdd,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [internalOptions, setInternalOptions] = useState<string[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoading: isLoading || fetchLoading,
  });

  const sizeClasses = {
    sm: "text-xs py-1.5 px-2.5",
    md: "text-sm py-2 px-3",
    lg: "text-sm py-2.5 px-4",
  };

  const chipSizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2.5",
    lg: "text-sm py-1.5 px-3",
  };

  // Transform any[] to string[]
  const transformToStringArray = (items: any[]): string[] => {
    if (!items || items.length === 0) return [];

    // If custom transform is provided, use it
    if (transformItems) {
      return transformItems(items);
    }

    // Check if items are already strings
    if (typeof items[0] === 'string') {
      return items as string[];
    }

    // If items are objects, extract using accessors
    if (typeof items[0] === 'object' && items[0] !== null) {
      return items.map(item => {
        // Try labelAccessor first, fallback to common keys
        const label = item[labelAccessor] || item.name || item.label || item.title;
        if (label) return String(label);
        
        // If no label found, try valueAccessor
        const val = item[valueAccessor] || item.id || item.value || item.key;
        if (val) return String(val);
        
        // Last resort: stringify the object
        return JSON.stringify(item);
      });
    }

    // Fallback: convert to strings
    return items.map(item => String(item));
  };

  // Update internal options when prop changes
  useEffect(() => {
    const transformed = transformToStringArray(options ?? []);
    setInternalOptions(transformed);
  }, [options, labelAccessor, valueAccessor]);

  // Debounced search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setHasSearched(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (fetchOptions) {
        setFetchLoading(true);
        try {
          const results = await fetchOptions(query);
          const transformed = transformToStringArray(results);
          setInternalOptions(transformed);
          setHasSearched(true);
        } catch (err) {
          console.error("Error fetching options:", err);
          setHasSearched(true);
        } finally {
          setFetchLoading(false);
        }
      } else if (onSearch) {
        await onSearch(query);
        setHasSearched(true);
      } else {
        setHasSearched(true);
      }
    }, debounceTime);
  };

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return internalOptions;
    
    if (filterOptions) {
      return filterOptions(internalOptions, searchQuery);
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    return internalOptions.filter(option => 
      option.toLowerCase().includes(lowerQuery)
    );
  }, [internalOptions, searchQuery, filterOptions]);

  // Remove selected items from dropdown options
  const availableOptions = React.useMemo(() => {
    if (allowDuplicates) return filteredOptions;
    
    const selectedSet = new Set(value);
    return filteredOptions.filter(option => !selectedSet.has(option));
  }, [filteredOptions, value, allowDuplicates]);

  const handleAddChip = (val: string) => {
    if (!val || val.trim() === '') return;
    if (maxChips && value.length >= maxChips) return;
    
    const trimmedValue = val.trim();
    const isDuplicate = value.includes(trimmedValue);
    
    if (!allowDuplicates && isDuplicate) return;
    
    const newValue = [...value, trimmedValue];
    onChange?.(newValue);
    onChipAdd?.(trimmedValue);
    
    if (clearOnSelect) {
      setSearchQuery("");
    }
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleRemoveChip = (val: string) => {
    const newValue = value.filter(v => v !== val);
    onChange?.(newValue);
    onChipRemove?.(val);
  };

  const handleClearAll = () => {
    onChange?.([]);
    setSearchQuery("");
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: remove last chip if input is empty
    if (e.key === 'Backspace' && searchQuery === '' && value.length > 0) {
      handleRemoveChip(value[value.length - 1]);
    }
    
    // Enter: add custom input or select first option
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!searchQuery.trim()) return;
      
      // If API is being used and still loading, don't add yet
      if (fetchOptions && fetchLoading) {
        return;
      }
      
      // If API was used and search has completed, check if we should add
      if (fetchOptions && hasSearched) {
        // If there are available options and allowCustomInput is true, add custom
        // Otherwise, only allow selection from dropdown
        if (allowCustomInput) {
          handleAddChip(searchQuery);
          setSearchQuery("");
        }
      } else if (!fetchOptions) {
        // No API - allow custom input if enabled
        if (allowCustomInput) {
          handleAddChip(searchQuery);
          setSearchQuery("");
        }
      }
    }
    
    // Escape: close dropdown
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const borderClass = error 
    ? "border-error" 
    : success 
    ? "border-success" 
    : "border-base-content/40";

  const labelColorClass = error 
    ? "text-error" 
    : success 
    ? "text-success" 
    : "text-base-content/40";

  const currentChipSize = chipSize || inputSize;

  // Show dropdown when:
  // 1. Not using API and has options
  // 2. Using API and has searched/loaded
  // 3. Always show if allowCustomInput and has search query
  const shouldShowDropdown = isOpen && !disabled && (
    availableOptions.length > 0 || 
    (fetchLoading && searchQuery.length > 0) ||
    (isLoading && searchQuery.length > 0)
  );

  return (
    <div
      ref={containerRef}
      className={cn("space-y-1 flex flex-col relative", fullWidth && "w-full", containerClassName)}
    >
      {label && (
        <Label 
          required={required} 
          className={cn(labelColorClass, labelClassName)}
          tooltip={tooltip}
          tooltipIcon={tooltipIcon}
        >
          {label}
        </Label>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-1.5 p-2 rounded-lg border transition-all min-h-[42px]",
          variant === "filled" ? "bg-base-1" : "bg-base-2",
          borderClass,
          disabled && "opacity-50 cursor-not-allowed bg-base-2",
          className
        )}
      >
        {/* Chips */}
        {value.map((chip) => {
          if (renderChip) {
            return (
              <div key={chip}>
                {renderChip(chip, () => handleRemoveChip(chip))}
              </div>
            );
          }

          return (
            <div
              key={chip}
              className={cn(
                "flex items-center gap-1.5 rounded-md bg-primary-100 text-body-content",
                chipSizeClasses[currentChipSize],
                chipClassName
              )}
            >
              <span className="max-w-[200px] truncate">{chip}</span>
              {showChipRemove && !disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveChip(chip)}
                  className="hover:text-error transition-colors"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
          );
        })}

        {/* Input */}
        <input
          ref={inputRef}
          name={name}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled || (maxChips ? value.length >= maxChips : false)}
          className={cn(
            "flex-1 min-w-[120px] bg-transparent outline-none text-body-content placeholder:text-base-content/30",
            sizeClasses[inputSize],
            "p-0"
          )}
        />

        {/* Clear button */}
        {value.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClearAll}
            className="ml-auto p-1 hover:text-error transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 border border-base-content/40 rounded-lg shadow-lg bg-base-1",
            "top-full"
          )}
          style={{ maxHeight }}
        >
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {(fetchLoading || isLoading) && availableOptions.length === 0 ? (
              <div className="p-4 text-center text-base-content/40 text-sm">
                Loading...
              </div>
            ) : availableOptions.length === 0 ? (
              <div className="p-4 text-center text-base-content/40 text-sm">
                {allowCustomInput && searchQuery.trim() 
                  ? `Press Enter to add "${searchQuery}"`
                  : noOptionsText}
              </div>
            ) : (
              <>
                {availableOptions.map((option, index) => {
                  const isSelected = value.includes(option);

                  if (renderOption) {
                    return (
                      <div
                        key={option}
                        onClick={() => handleAddChip(option)}
                        className="cursor-pointer"
                      >
                        {renderOption(option, isSelected)}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={option}
                      onClick={() => handleAddChip(option)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors",
                        "hover:bg-primary-100 text-body-content",
                        index === 0 && "rounded-t-lg",
                        index === availableOptions.length - 1 && !hasMore && "rounded-b-lg"
                      )}
                    >
                      <span className="text-sm">{option}</span>
                      {isSelected && (
                        <Icon name="Check" size={16} className="text-success" />
                      )}
                    </div>
                  );
                })}

                {onLoadMore && hasMore && <div ref={sentinelRef} className="h-4" />}

                {(isLoading || fetchLoading) && availableOptions.length > 0 && (
                  <div className="p-3 text-center text-base-content/30 text-sm">
                    Loading more...
                  </div>
                )}

                {onLoadMore && hasMore && !isLoading && !fetchLoading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onLoadMore(); }}
                    className="w-full p-2 text-base-content/40 hover:bg-base-2 transition-colors text-sm"
                  >
                    {loadMoreText}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Helper text / Error */}
      {(helperText || error) && (
        <ErrorText className={error ? "text-error" : "text-base-content/40"}>
          {error || helperText}
        </ErrorText>
      )}
    </div>
  );
});

DropdownWithChips.displayName = "DropdownWithChips";

export { DropdownWithChips };