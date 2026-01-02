import React from "react";
import { ColumnDef, ActionMenuItem, ExpandedRowConfig, ClassNameConfig } from "./table.types";
import { TableRow } from "./TableRow";
import Icon from "../base/Icon";
import { IconName } from "demaze-ui-lib/components";

interface TableBodyProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  selectable?: boolean;
  selectedRows?: Set<any>;
  onRowSelect?: (rowKey: any, selected: boolean) => void;
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  hoverable?: boolean;
  striped?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  actions?: ActionMenuItem[];
  singleIcon?: {
    name: string;
    onClick: (row: T) => void;
    tooltip?: string;
  };
  expandedRowConfig?: ExpandedRowConfig<T>;
  bodyClassNameConfig?: ClassNameConfig["tableBody"];
  rowClassNameConfig?: ClassNameConfig["tableBody"];
}

export const TableBody = <T,>({
  data,
  columns,
  selectable,
  selectedRows,
  onRowSelect,
  rowKey = "id" as keyof T,
  onRowClick,
  hoverable,
  striped,
  loading,
  emptyMessage = "No data available",
  emptyIcon = "Inbox" as IconName,
  actions,
  singleIcon,
  expandedRowConfig,
  bodyClassNameConfig,
  rowClassNameConfig,
}: TableBodyProps<T>) => {
  const getRowKey = (row: T): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey] as string | number;
  };

  // Loading skeleton - COMPACT
  if (loading) {
    return (
      <tbody>
        {[...Array(12)].map((_, idx) => (
          <tr key={idx} className="border-b border-base-3">
            {selectable && (
              <td className="px-2 py-1.5">
                <div className="w-8 h-8 bg-base-3 rounded-xl shimmer" />
              </td>
            )}
            {columns.map((col) => (
              <td key={col.key} className="px-3 py-1.5">
                <div className="h-10 bg-base-3 rounded-xl shimmer" />
              </td>
            ))}
            {actions?.length && (
              <td className="px-2 py-1.5">
                <div className="h-10 w-10 bg-base-3 rounded-xl shimmer mx-auto" />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  }

  // Empty state - COMPACT
  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length + (selectable ? 1 : 0) + 1} className="px-3 py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <Icon name={emptyIcon as IconName} size={36} className="text-disabled-content" />
              <p className="text-xs text-body-content">{emptyMessage}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={bodyClassNameConfig?.container}>
      {data.map((row, index) => {
        const key = getRowKey(row);
        const isSelected = selectedRows?.has(key);

        return (
          <TableRow
            key={key}
            row={row}
            index={index}
            columns={columns}
            selectable={selectable}
            isSelected={isSelected}
            onSelect={(selected) => onRowSelect?.(key, selected)}
            onClick={() => onRowClick?.(row)}
            hoverable={hoverable}
            actions={actions}
            singleIcon={singleIcon}
            expandedRowConfig={expandedRowConfig}
            classNameConfig={rowClassNameConfig}
          />
        );
      })}
    </tbody>
  );
};
