import { cn } from "@/utils/helpers";
import React from "react";
import {Icon} from "../base/Icon";
import { ColumnDef } from "./table.types";

interface TableHeadProps<T> {
  columns: ColumnDef<T>[];
  selectable?: boolean;
  allSelected?: boolean;
  onSelectAll?: (selected: boolean) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  containsAction?:boolean
}

export const TableHead = <T,>({
  columns,
  selectable,
  allSelected,
  onSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  containsAction=true
}: TableHeadProps<T>) => {
  const hasSubColumns = columns.some(col => col.subColumns && col.subColumns.length > 0);

  const flatColumns: any[] = [];
  columns.forEach(col => {
    if (col.subColumns && col.subColumns.length > 0) {
      flatColumns.push(...col.subColumns);
    }
  });
const renderSortIcons = (colKey: string) => {
  const isAsc = sortColumn === colKey && sortDirection === "asc";
  const isDesc = sortColumn === colKey && sortDirection === "desc";



  console.log("contains-action----------" , containsAction)

  return (
    <div className="flex flex-col items-center leading-none">

      <Icon
        name="Triangle"
        size={8}
        className={cn(
          "stroke-[1.5] transition-colors",
          isAsc 
            ? "stroke-base-content fill-base-content"  
            : "stroke-base-content fill-transparent"   
        )}
      />

      <Icon
        name="Triangle"
        size={8}
        className={cn(
          "rotate-180 stroke-[1.5] transition-colors",
          isDesc
            ? "stroke-base-content fill-base-content"   
            : "stroke-base-content fill-transparent"    
        )}
      />

    </div>
  );
};











  return (
    <thead className="bg-base-2 border-y border-base-content/20">
      {hasSubColumns && (
        <tr>
          {selectable && (
            <th rowSpan={2} className="w-12 px-4 py-4">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll?.(e.target.checked)}
                className="w-4 h-4 rounded border-base-3 text-primary-500 focus:ring-2 focus:ring-primary-500"
              />
            </th>
          )}

{columns.map((col) => {
  if (col.subColumns && col.subColumns.length > 0) {
    return (
      <th
        key={col.key}
        colSpan={col.subColumns.length}
        className="px-4 py-3 text-center text-sm font-medium text-base-content uppercase tracking-wider  last:border-r-0"
      >
        {col.header}
      </th>
    );
  } else {
    return (
      <th
        key={col.key}
        rowSpan={2}
        style={{ width: col.width }}
        className="px-4 py-5 text-left text-sm font-medium text-base-content uppercase tracking-wider"
      >
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      col.sortable && "cursor-pointer select-none hover:text-primary-500",
                      col.align === 'center' && "justify-center",
                      col.align === 'right' && "justify-end"
                    )}
                    onClick={() => col.sortable && onSort?.(col.key)}
                  >
                    {col.header}
                    {col.sortable && renderSortIcons(col.key)}
                  </div>
                </th>
              );
            }
          })}

         {containsAction && <th rowSpan={2} className="w-16 px-4 py-3 text-center text-sm font-medium text-base-content uppercase">
            Action--
          </th>}
        </tr>
      )}

      <tr>
        {!hasSubColumns && selectable && (
          <th className="w-12 px-4 py-4">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              className="w-4 h-4 rounded border-base-3 text-primary-500 focus:ring-2 focus:ring-primary-500"
            />
          </th>
        )}

{hasSubColumns ? (
  flatColumns.map((col, idx) => {
    const isLastInGroup = idx === flatColumns.length - 1;
    
    return (
      <th
        key={col.key}
        style={{ width: col.width }}
        className={cn(
          "px-3 py-2 text-left text-xs font-medium text-base-content uppercase tracking-wider relative",
          col.align === 'center' && "text-center",
          col.align === 'right' && "text-right"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1",
            col.sortable && "cursor-pointer select-none hover:text-primary-500",
            col.align === 'center' && "justify-center",
            col.align === 'right' && "justify-end"
          )}
          onClick={() => col.sortable && onSort?.(col.key)}
        >
          {col.header}
          {col.sortable && renderSortIcons(col.key)}
        </div>
        
        {!isLastInGroup && (
          <div className="absolute right-0 top-2 bottom-2 w-px bg-base-content" />
        )}
      </th>
    );
  })
) : (
          columns.map((col) => (
            <th
              key={col.key}
              style={{ width: col.width }}
              className={cn(
                "px-4 py-5 text-left text-sm font-medium text-base-content uppercase tracking-wider",
                col.align === 'center' && "text-center",
                col.align === 'right' && "text-right"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  col.sortable && "cursor-pointer select-none hover:text-primary-500",
                  col.align === 'center' && "justify-center",
                  col.align === 'right' && "justify-end"
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                {col.header}
                {col.sortable && renderSortIcons(col.key)}
              </div>
            </th>
          ))
        )}

        {!hasSubColumns && containsAction  &&(
          <th className="w-16 px-4 py-3 text-center text-sm font-medium text-base-content uppercase">
            Action
          </th>
        )}
      </tr>
    </thead>
  );
};