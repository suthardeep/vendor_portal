// TableHeader.tsx - Fixed with proper dependencies
import { cn } from "@/utils/helpers";
import React, { useState, useEffect, useMemo } from "react";
import {Icon , IconName } from "../base/Icon";
import { Button } from "../base/Button";
import { ActionButton, BreadcrumbConfig, FilterConfig, FilterChip } from "./table.types";
import { FilterSidebar } from "../base/FilterSidebar";
import { FilterRenderer } from "./FilterRendered";

interface TableHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbConfig;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  filterChips?: FilterChip[]; // New prop for chips
  actions?: ActionButton[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  breadcrumbs,
  searchable,
  searchPlaceholder = "Search...",
  onSearch,
  filters = [],
  filterChips = [],
  actions,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, any>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  
  // Memoize filterChips to prevent unnecessary re-renders
  const defaultActiveChips = useMemo(() => 
    filterChips.filter(chip => chip.defaultActive).map(chip => chip.key),
    [filterChips]
  );
  
  const [activeChips, setActiveChips] = useState<Set<string>>(
    new Set(defaultActiveChips)
  );

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.items.length > 0;

  // Calculate what can fit: Max 4 things total
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

  // FIXED: Use useMemo to create stable filter keys
  const filterKeys = useMemo(() => 
    filters.map(filter => filter.key).join(','), 
    [filters]
  );

  // FIXED: Use appliedFilters and filterKeys as dependencies
  useEffect(() => {
    const initial: Record<string, any> = {};
    filters.forEach((filter) => {
      initial[filter.key] = appliedFilters[filter.key] !== undefined 
        ? appliedFilters[filter.key] 
        : filter.value;
    });
    setPendingFilters(initial);
  }, [appliedFilters, filterKeys]); // Use filterKeys instead of filters

  // Alternative: Only run once on mount and when filters actually change
  // useEffect(() => {
  //   const initial: Record<string, any> = {};
  //   filters.forEach((filter) => {
  //     initial[filter.key] = appliedFilters[filter.key] !== undefined 
  //       ? appliedFilters[filter.key] 
  //       : filter.value;
  //   });
  //   setPendingFilters(initial);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Empty dependency array if you only want to run once

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
      if (filter.type === 'daterange') {
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
    const chip = filterChips.find(c => c.key === chipKey);
    
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
      
      if (filter.type === 'daterange') {
        return value.start || value.end;
      }
      return value !== "";
    }).length;
  };

  const renderControls = (isBreadcrumbLayout: boolean) => {
    const searchSize = isBreadcrumbLayout ? "sm" : "md";
    const containerClass = isBreadcrumbLayout
      ? "flex flex-wrap gap-2 items-center w-full lg:w-auto lg:ml-auto bg-white"
      : "flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto bg-white";

    return (
      <div className={containerClass}>
        {/* Search Bar */}
        {searchable && (
          <div className="relative shrink-0 bg-white">
            <Icon
              name="Search"
              size={isBreadcrumbLayout ? 16 : 18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className={cn(
                "w-full pl-9 pr-3 text-sm bg-transparent border border-base-content/20 rounded-lg outline-none focus:border-primary transition-all",
                isBreadcrumbLayout ? "sm:w-48 h-9" : "sm:w-64 h-10"
              )}
            />
          </div>
        )}

        {/* Inline Filters */}
        {headerFilters.map((filter) => (
          <div key={filter.key} className="flex-shrink-0">
            <FilterRenderer
              filter={filter}
              value={appliedFilters[filter.key] !== undefined 
                ? appliedFilters[filter.key] 
                : filter.value}
              onChange={(value) => handleHeaderFilterChange(filter.key, value)}
              size={searchSize}
              variant="outlined"
            />
          </div>
        ))}

        {/* Filters Button */}
        {shouldShowFilterButton && (
          <div className="relative flex-shrink-0">
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant="outline"
              color="primary"
              size={searchSize}
              startIcon="SlidersHorizontal"
              className={cn(
                "whitespace-nowrap border border-base-content/20",
                isBreadcrumbLayout ? "text-xs h-9" : "rounded-md"
              )}
            >
              Filters
            </Button>
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {actions && actions.length > 0 && actions?.map((action, idx) => (
          <Button
            key={idx}
            onClick={action.onClick}
            variant={action.variant === "primary" ? "filled" : "outline"}
            color="primary"
            size={searchSize}
            startIcon={action.icon as IconName}
            className={cn(
              "whitespace-nowrap flex-shrink-0",
              isBreadcrumbLayout ? "text-xs h-9" : "rounded-md",
              action.variant === "outlined" ,
              action.className
            )}
          >
            {action.label}
          </Button>
        ))}
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
        <div className="py-5 px-4 bg-red-500">
          <div className="space-y-3 bg-red-400">
            {title && (
              <h2 className="text-base-content font-semibold">
                {title}
              </h2>
            )}

            {breadcrumbs?.heading && (
              <p className="text-xs text-base-content/60 font-medium tracking-wide">
                {breadcrumbs.heading}
              </p>
            )}

            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {breadcrumbs.items.map((item, index) => {
                  const colorClass = colorClasses[index % colorClasses.length];
                  const showArrow =
                    breadcrumbs.showSeparator &&
                    index < breadcrumbs.items.length - 1;

                  return (
                    <React.Fragment key={index}>
                      <button
                        onClick={() => handleBreadcrumbClick(item, index)}
                        className={cn(
                          "px-2 py-1.5 text-xs rounded-md font-medium whitespace-nowrap transition-colors duration-200",
                          colorClass,
                          breadcrumbs.onItemClick && "cursor-pointer"
                        )}
                      >
                        {item}
                      </button>
                      {showArrow && (
                        <span className="text-base-content/60 text-sm select-none">
                          ›
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {renderControls(true)}
            </div>
          </div>
        </div>

        {/* Filter Chips Row - Full Width Second Row */}
        {filterChips.length > 0 && (
          <div className="py-3 px-4 border-t border-base-content/10">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              {filterChips.map((chip) => {
                const isActive = activeChips.has(chip.key);
                return (
                  <div
                    key={chip.key}
                    onClick={() => handleChipToggle(chip.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors",
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
      <div className="py-5 px-4 bg-white">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {title && (
            <h2 className="text-lg md:text-xl font-semibold text-base-content">
              {title}
            </h2>
          )}

          {renderControls(false)}
        </div>
      </div>

      {/* Filter Chips Row - Full Width Second Row */}
      {filterChips.length > 0 && (
        <div className="py-3 px-4 border-t border-base-content/10">
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {filterChips.map((chip) => {
              const isActive = activeChips.has(chip.key);
              return (
                <div
                  key={chip.key}
                  onClick={() => handleChipToggle(chip.key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-normal rounded-md cursor-pointer transition-colors",
                    isActive 
                      ? "bg-secondary-500/30 text-base-content/80" 
                      : "bg-secondary-500/10  text-base-content/80"
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