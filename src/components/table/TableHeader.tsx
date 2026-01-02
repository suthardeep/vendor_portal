import { cn } from "@/utils/helpers";
import React, { useState, useEffect, useMemo } from "react";
import Icon, { IconName } from "../base/Icon";
import { Button } from "../base/Button";
import { ActionButton, BreadcrumbConfig, FilterConfig, FilterChip, ClassNameConfig } from "./table.types";
import { FilterSidebar } from "../base/FilterSidebar";
import { FilterRenderer } from "./FilterRendered";
import { Input } from "../base/Input";

interface TableHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbConfig;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  filterChips?: FilterChip[];
  actions?: ActionButton[];
  classNameConfig?: ClassNameConfig["tableHeader"];
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  breadcrumbs,

  searchable,
  searchPlaceholder = "Search",
  onSearch,
  filters = [],
  filterChips = [],
  actions,
  classNameConfig,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, any>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  const defaultActiveChips = useMemo(
    () => filterChips.filter((chip) => chip.defaultActive).map((chip) => chip.key),
    [filterChips]
  );

  const [activeChips, setActiveChips] = useState<Set<string>>(new Set(defaultActiveChips));

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.items.length > 0;

  const itemCount = (searchable ? 1 : 0) + (actions?.length || 0);

  let headerFilters: FilterConfig[] = [];
  let sidebarFilters: FilterConfig[] = [];
  let shouldShowFilterButton = false;

  if (itemCount >= 3) {
    sidebarFilters = filters;
    shouldShowFilterButton = filters.length > 0;
  } else if (itemCount === 2) {
    if (filters.length <= 1) {
      headerFilters = filters;
    } else {
      sidebarFilters = filters;
      shouldShowFilterButton = true;
    }
  } else {
    if (filters.length <= 2) {
      headerFilters = filters;
    } else {
      headerFilters = filters.slice(0, 1);
      sidebarFilters = filters.slice(1);
      shouldShowFilterButton = true;
    }
  }

  const filterKeys = useMemo(() => filters.map((filter) => filter.key).join(","), [filters]);

  useEffect(() => {
    const initial: Record<string, any> = {};
    filters.forEach((filter) => {
      initial[filter.key] =
        appliedFilters[filter.key] !== undefined ? appliedFilters[filter.key] : filter.value;
    });
    setPendingFilters(initial);
  }, [appliedFilters, filterKeys]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleBreadcrumbClick = (item: string, index: number) => {
    breadcrumbs?.onItemClick?.(item, index);
  };

  const handleHeaderFilterChange = (key: string, value: any) => {
    const filter = filters.find((f) => f.key === key);
    filter?.onChange?.(value);
    setAppliedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSidebarFilterChange = (key: string, value: any) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    sidebarFilters.forEach((filter) => {
      const value = pendingFilters[filter.key];
      filter.onChange?.(value);
    });
    setAppliedFilters((prev) => ({ ...prev, ...pendingFilters }));
    setIsSidebarOpen(false);
  };

  const handleResetFilters = () => {
    const resetValues: Record<string, any> = {};
    filters.forEach((filter) => {
      if (filter.type === "daterange") {
        resetValues[filter.key] = { start: null, end: null };
      } else {
        resetValues[filter.key] = "";
      }
      filter.onChange?.(resetValues[filter.key]);
    });
    setPendingFilters(resetValues);
    setAppliedFilters({});
  };

  const handleChipToggle = (chipKey: string) => {
    const newActiveChips = new Set(activeChips);
    const chip = filterChips.find((c) => c.key === chipKey);

    if (newActiveChips.has(chipKey)) {
      newActiveChips.delete(chipKey);
    } else {
      newActiveChips.add(chipKey);
    }

    setActiveChips(newActiveChips);
    chip?.onChange?.(newActiveChips.has(chipKey));
  };

  const getActiveFilterCount = () => {
    return filters.filter((filter) => {
      const value = appliedFilters[filter.key];
      if (!value) return false;

      if (filter.type === "daterange") {
        return value.start || value.end;
      }
      return value !== "";
    }).length;
  };

  const renderControls = (isBreadcrumbLayout: boolean = !!Object.keys(breadcrumbs || {}).length) => {
    // LOGIC:
    // 1. If Title Exists: We push everything to the Right (justify-end / ml-auto).
    // 2. If No Title: We keep everything on the Left (justify-start / ml-0).
    // This satisfies "Title on left most side, rest right" and "No Title -> Search left, rest left".

    const containerClass = isBreadcrumbLayout
      ? cn(
          "flex flex-wrap gap-2 items-center w-full lg:w-auto",
          title ? "lg:ml-auto" : "" // Only push to right if title exists
        )
      : cn(
          "flex flex-col sm:flex-row gap-2 items-center w-full",
          title ? "justify-end" : "justify-between" // Right if title, Left if no title
        );

    return (
      <div className={containerClass}>
        {/* Search - Always first. 
            Added sm:w-auto so it doesn't stretch full width on desktop when left aligned 
        */}
        {searchable && (
          <div className="relative shrink-0 w-full sm:w-auto">
            <Input
              type="text"
              title={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              showClearAll
              leftElement={<Icon name="Search" className="w-4 h-4 text-disabled-content" />}
              className="w-full sm:w-48 h-8 py-0.5 rounded-md truncate"
            />
          </div>
        )}

        {/* Wrapper for Filters & Actions 
            Ensures they sit next to search without breaking flow 
        */}
        <div className="flex items-center gap-2 shrink-0 no-scrollbar">
          {/* Inline Filters */}
          {
            headerFilters.map((filter) => (
              <div key={filter.key} className="shrink-0">
                <FilterRenderer
                  filter={filter}
                  value={
                    appliedFilters[filter.key] !== undefined
                      ? appliedFilters[filter.key]
                      : filter.value
                  }
                  onChange={(value) => handleHeaderFilterChange(filter.key, value)}
                  size="sm"
                  variant="outlined"
                />
              </div>
            ))}

          {/* Filters Button */}
          {shouldShowFilterButton && (
            <div className="relative shrink-0">
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                color="primary"
                size="sm"
                startIcon="SlidersHorizontal"
                className="whitespace-nowrap border border-base-content/20 text-xs h-8 px-3"
              >
                Filters
              </Button>
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {actions &&
            actions.length > 0 &&
            actions.map((action, idx) => (
              <Button
                key={idx}
                onClick={action.onClick}
                variant={action.variant}
                color="primary"
                size="sm"
                startIcon={action.icon as IconName}
                className={cn(
                  "whitespace-nowrap text-sm shrink-0 h-8 px-3",
                  action.className
                )}
              >
                {action.label}
              </Button>
            ))}
        </div>
      </div>
    );
  };

  if (hasBreadcrumbs) {
    const colorClasses = [
      "text-primary bg-primary/10 hover:bg-primary/20",
      "text-error bg-error/10 hover:bg-error/20",
      "text-accent bg-accent/10 hover:bg-accent/20",
      "text-success bg-success/10 hover:bg-success/20",
      "text-warning bg-warning/10 hover:bg-warning/20",
    ];

    return (
      <>
        <div className={cn("py-3 px-4", classNameConfig?.container)}>
          <div className="space-y-2">
            {title && <p className="text-base font-semibold text-base-content w-full">{title}</p>}

            {breadcrumbs?.heading && (
              <p className="text-xs text-base-content/60 font-medium tracking-wide">{breadcrumbs.heading}</p>
            )}

            <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {breadcrumbs.items.map((item, index) => {
                  const colorClass = colorClasses[index % colorClasses.length];
                  const showArrow = breadcrumbs.showSeparator && index < breadcrumbs.items.length - 1;

                  return (
                    <React.Fragment key={index}>
                      <button
                        onClick={() => handleBreadcrumbClick(item, index)}
                        className={cn(
                          "px-2 py-1 text-xs rounded font-medium whitespace-nowrap transition-colors duration-200",
                          colorClass,
                          breadcrumbs.onItemClick && "cursor-pointer"
                        )}
                      >
                        {item}
                      </button>
                      {showArrow && <span className="text-base-content/60 text-xs select-none">›</span>}
                    </React.Fragment>
                  );
                })}
              </div>

              {renderControls()}
            </div>
          </div>
        </div>

        {filterChips.length > 0 && (
          <div className="py-2 px-4 border-t border-base-content/10">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              {filterChips.map((chip) => {
                const isActive = activeChips.has(chip.key);
                return (
                  <div
                    key={chip.key}
                    onClick={() => handleChipToggle(chip.key)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors",
                      isActive
                        ? "bg-base-content/10 text-base-content/70 hover:bg-base-content/15"
                        : "bg-base-content/80 text-white"
                    )}
                  >
                    {chip.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sidebarFilters.length > 0 && (
          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={sidebarFilters}
            pendingFilters={pendingFilters}
            onFilterChange={handleSidebarFilterChange}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={cn("py-3 px-4", classNameConfig?.container)}>
        <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
          {/* Title - Renders on Left */}
          {title && (
            <span className={cn("text-lg font-semibold text-base-content w-full whitespace-nowrap lg:w-auto", classNameConfig?.title)}>
              {title}
            </span>
          )}

          {/* Controls - Renders on Right (if title exists) or Left (if no title) */}
          {renderControls()}
        </div>
      </div>

      {filterChips.length > 0 && (
        <div className="py-2 px-4 border-t border-base-content/10">
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {filterChips.map((chip) => {
              const isActive = activeChips.has(chip.key);
              return (
                <div
                  key={chip.key}
                  onClick={() => handleChipToggle(chip.key)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-normal rounded cursor-pointer transition-colors",
                    isActive
                      ? "bg-secondary-500/30 text-base-content/80"
                      : "bg-secondary-500/10 text-base-content/80"
                  )}
                >
                  {chip.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sidebarFilters.length > 0 && (
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={sidebarFilters}
          pendingFilters={pendingFilters}
          onFilterChange={handleSidebarFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}
    </>
  );
};

// CONSISTENT SIZING:
// - Title: text-sm (slightly bigger for heading)
// - All controls: text-xs
// - All inputs/buttons: h-8
// - py-3 (header padding)