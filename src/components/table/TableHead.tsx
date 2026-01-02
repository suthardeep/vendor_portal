import { cn } from "@/utils/helpers";
import React from "react";
import Icon from "../base/Icon";
import { ClassNameConfig, ColumnDef, SortDirection } from "./table.types";

interface TableHeadProps<T> {
  columns: ColumnDef<T>[];
  selectable?: boolean;
  allSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  containsAction?: boolean;
  classNameConfig?: ClassNameConfig["tableHead"]
  hasMainHeader?: boolean;
}

export const TableHead = <T,>({
  columns,
  selectable,
  allSelected,
  onSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  containsAction = true,
  hasMainHeader = true,
}: TableHeadProps<T>) => {
  const hasSubColumns = columns.some((col) => col.subColumns && col.subColumns.length > 0);

  const renderSortIcons = (colKey: string) => {
    const isAsc = sortColumn === colKey && sortDirection === "asc";
    const isDesc = sortColumn === colKey && sortDirection === "desc";
    // const isDefault = sortColumn === colKey && sortDirection === "default";


    return (
      <div className="flex flex-col items-center leading-none -space-y-0.5">
        <Icon
          name="Triangle"
          size={8}
          className={cn(
            "stroke-[1.5] transition-colors",
            isAsc ? "stroke-base-content fill-base-content" : "stroke-base-content/40 fill-transparent"
          )}
        />
        <Icon
          name="Triangle"
          size={8}
          className={cn(
            "rotate-180 stroke-[1.5] transition-colors",
            isDesc ? "stroke-base-content fill-base-content" : "stroke-base-content/40 fill-transparent"
          )}
        />
      </div>
    );
  };

  // ORIGINAL COLORS & STICKY CONFIG
  const headerBaseClass = cn(
    "px-3 py-3 border-b border-base-content/20 border-t border-base-content/20 text-[12px] text-base-content uppercase tracking-wide sticky top-0 z-20",
    hasMainHeader ? "bg-base-2" : "bg-base-1 border-t-0 rounded-t-lg");

  return (
    <thead className={cn("relative z-20 rounded-t-lg")}>
      <tr >
        {selectable && (
          <th className={cn(headerBaseClass, "w-12 text-center ")}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              className="w-4 h-4 rounded border-base-3 text-primary-500 focus:ring-1 cursor-pointer"
            />
          </th>
        )}

        {columns.map((col) => (
          <th
            key={col.key}
            style={{ width: col.width }}
            className={cn(
              headerBaseClass,
              col.align === "center" && "text-center",
              col.align === "right" && "text-right"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 font-semibold",
                col.sortable && "cursor-pointer select-none",
                col.align === "center" && "justify-center",
                col.align === "right" && "justify-end"
              )}
              onClick={() => col.sortable && onSort?.(col.key)}
            >
              {col.header}
              {col.sortable && renderSortIcons(col.key)}
            </div>
          </th>
        ))}

        {/* ✅ Always render this th for consistent borders, but conditionally show content */}
        {containsAction && (
          <th className={cn(headerBaseClass, "w-16 text-center")}>{containsAction && "Action"}</th>
        )}
      </tr>
    </thead>
  );
};
