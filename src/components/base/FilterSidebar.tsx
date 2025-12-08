import React, { useState } from "react";
import { cn } from "@/utils/helpers";
import Icon from "../base/Icon";
import {Dropdown} from "@/components/base/Dropdown";
import { Button } from "../base/Button";
import { ActionButton, BreadcrumbConfig, FilterConfig } from "../table/table.types";

// Filter Sidebar Component
interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterConfig[];
  pendingFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  pendingFilters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300 z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl transition-transform duration-300 z-50 flex flex-col",
          "bg-white dark:bg-gray-900",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-black">
          <h3 className="text-lg font-semibold text-base-1">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-base-content/5 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-base-content/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  {filter.label}
                </label>
                <Dropdown
                  value={pendingFilters[filter.key]}
                  onChange={(value) => onFilterChange(filter.key, value)}
                  options={filter.options}
                  placeholder={`Select ${filter.label}`}
                  inputSize="md"
                  variant="outlined"
                  containerClassName="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-base-content/10 px-6 py-4">
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              color="primary"
              size="md"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onApply}
              variant="filled"
              color="primary"
              size="md"
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export  {FilterSidebar};