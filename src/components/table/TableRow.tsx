import { cn } from "@/utils/helpers";
import React from "react";
import { ColumnDef, ActionMenuItem, SubColumnDef, ExpandedRowConfig } from "./table.types";
import { ImageCell } from "./cells/ImageCell";
import { BadgeCell } from "./cells/BadgeCell";
import { RatingCell } from "./cells/RatingCell";
import { InputCell } from "./cells/InputCell";
import { ActionCell } from "./cells/ActionCell";

interface TableRowProps<T> {
  row: T;
  index: number;
  columns: ColumnDef<T>[];
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  hoverable?: boolean;
  actions?: ActionMenuItem[];
  singleIcon?: { 
    name: string;
    onClick: (row: T) => void;
    tooltip?: string;
  };
  expandedRowConfig?: ExpandedRowConfig<T>;
  totalColumns?: number;
}

export const TableRow = <T,>({
  row,
  index,
  columns,
  selectable,
  isSelected,
  onSelect,
  onClick,
  hoverable = true,
  actions,
  singleIcon,
  expandedRowConfig,
  totalColumns
}: TableRowProps<T>) => {

  const renderCell = (column: ColumnDef<T> | SubColumnDef<T>) => {
    if (column.render) {
      return column.render(row, index);
    }

    const value = (row as any)[column.key];

    switch (column.cellType) {
      case "image":
        return <ImageCell row={row} {...column.imageConfig} />;
      case "badge":
        return <BadgeCell value={value} {...column.badgeConfig} />;
      case "rating":
        return <RatingCell row={row} valueKey={column.key} {...column.ratingConfig} />;
      case "input":
        return <InputCell row={row} valueKey={column.key} {...column.inputConfig} />;
      default:
        return (
          <span className={cn(" font-light text-base  text-base-content", column.cellClassName)}>
            {value}
          </span>
        );
    }
  };

  const flatColumns: (ColumnDef<T> | SubColumnDef<T>)[] = [];
  columns.forEach(col => {
    if (col.subColumns && col.subColumns.length > 0) {
      flatColumns.push(...col.subColumns);
    } else {
      flatColumns.push(col);
    }
  });

  // Check if this row should have expanded content
  const shouldShowExpanded = expandedRowConfig?.shouldExpand 
    ? expandedRowConfig.shouldExpand(row) 
    : false;

  // Calculate colspan for expanded row
  const colspan = totalColumns || (
    flatColumns.length + 
    (selectable ? 1 : 0) + 
    1 // for action column
  );

  return (
    <>
      <tr
        onClick={onClick}
        className={cn(
          "border-b border-base-3 transition-colors",
          hoverable && "hover:bg-base-2",
          onClick && "cursor-pointer",
          shouldShowExpanded && "border-b-0" // Remove border if expanded row follows
        )}
      >
        {selectable && (
          <td className="px-4 py-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect?.(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-base-3 text-primary-500 focus:ring-2 focus:ring-primary-500"
            />
          </td>
        )}

        {flatColumns.map((column, idx) => {
          let isInSubGroup = false;
          let isLastInSubGroup = false;
          
          columns.forEach(parentCol => {
            if (parentCol.subColumns) {
              const subIdx = parentCol.subColumns.findIndex(sub => sub.key === column.key);
              if (subIdx !== -1) {
                isInSubGroup = true;
                isLastInSubGroup = subIdx === parentCol.subColumns.length - 1;
              }
            }
          });
          
          return (
            <td
              key={column.key}
              className={cn(
                "px-4 py-3 relative",
                column.align === 'center' && "text-center",
                column.align === 'right' && "text-right",
                !column.align && "text-left",
                column.cellClassName
              )}
            >
              <div className={cn(
                column.align === 'center' && "text-center",
                column.align === 'right' && "text-right",
                column.align === 'left' && "text-left"
              )}>
                {renderCell(column)}
              </div>
              
              {isInSubGroup && !isLastInSubGroup && (
                <div className="absolute right-0 top-5 bottom-5 w-px bg-base-content" />
              )}
            </td>
          );
        })}

        <td className="px-4 py-3 text-center">
          <ActionCell row={row} actions={actions} singleIcon={singleIcon}/>
        </td>
      </tr>

      {/* Expanded Row Content */}
      {shouldShowExpanded && expandedRowConfig && (
        <tr className="border-b border-base-3 ">
          <td colSpan={colspan} className="px-4 py-3">
            <div className="rounded-lg bg-base-1 p-4">
              {expandedRowConfig.render(row)}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};