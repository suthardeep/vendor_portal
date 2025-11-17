import Checkbox from "@/components/base/Checkbox";
import NoSearchResult from "@/components/empty-states/NoSearchResult";
import { cn } from "@/utils/helpers";
// import {
//   hasAnyActionPermission,
//   shouldRenderOptionsColumn,
// } from "@/utils/rbac";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { MoveDown, MoveUp } from "lucide-react";
import React from "react";
import type { PaginationProps } from "../Pagination";
import Pagination from "../Pagination";
import TableCell from "./TableCell";

interface SortIconsProps {
  fieldName: string;
}

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const {
    columns,
    data,
    emptyMessage,
    enableRowSelection,
    filterComponent,
    isLoading,
    pagination,
    size = "md",
    rowSelectionKey = "id",
    className = "",
    onRowClick,
    // showTableOptions,
    customRender,
    isMuted = false,
    ...rest
  } = props;

  const renderCell = (row: T, column: TableColumn<T>) => {
    const value =
      typeof column.accessor === "function"
        ? column.accessor(row)
        : row[column.accessor];

    return column.cell ? column.cell(value, row) : value;
  };

  const selectedIds =
    enableRowSelection && "selectedIds" in rest ? rest.selectedIds : [];

  const onRowSelection =
    enableRowSelection && "onRowSelection" in rest
      ? rest.onRowSelection
      : undefined;

  const getRowId = (row: T) => String(row[rowSelectionKey]);

  const allRowsSelected =
    enableRowSelection &&
    data.length > 0 &&
    data.every((row) => selectedIds.includes(getRowId(row)));

  const someRowsSelected =
    enableRowSelection &&
    data.some((row) => selectedIds.includes(getRowId(row)));

  const toggleSelectAll = () => {
    if (!onRowSelection) return;

    const allSelected = data.every((row) =>
      selectedIds.includes(getRowId(row)),
    );

    data.forEach((row) => {
      const rowId = getRowId(row);
      const isSelected = selectedIds.includes(rowId);

      if (allSelected && isSelected) {
        onRowSelection(rowId);
      } else if (!allSelected && !isSelected) {
        onRowSelection(rowId);
      }
    });
  };

  // const hasOptionsColumn = shouldRenderOptionsColumn(data, showTableOptions);

  if (data?.length < 1 && !isLoading) {
    return (
      <div className="fall bg-neutral-content dark:bg-base-3/70 mt-4 flex-col rounded-xl p-6">
        <NoSearchResult />
        <h6 className="text-base-3 dark:text-base-2">
          {" "}
          {emptyMessage || "No data found"}{" "}
        </h6>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col rounded-xl", className)}>
      {filterComponent && <div className="mt-4">{filterComponent}</div>}

      <div className="w-full">
        <div className="no-scrollbar border-neutral-content/80 dark:border-base-3/80 w-full overflow-hidden overflow-x-auto rounded-xl border">
          <table className="divide-neutral-content/60 dark:divide-base-3/60 w-full divide-y">
            <thead className="bg-neutral-content dark:bg-base-3">
              <tr>
                {enableRowSelection && (
                  <th className={cn(paddingMap[size], checkboxClasses)}>
                    <Checkbox
                      checked={allRowsSelected}
                      indeterminate={!allRowsSelected && someRowsSelected}
                      onChange={toggleSelectAll}
                      size="sm"
                    />
                  </th>
                )}
                {columns?.map((column, index) => {
                  let sortFieldName = "";
                  if (column.isSortable) {
                    if (column.sortField) {
                      sortFieldName = column.sortField;
                    } else if (typeof column.accessor === "string") {
                      sortFieldName = column.accessor as string;
                    } else if (typeof column.accessor === "function") {
                      sortFieldName = extractFieldNameFromAccessor(
                        column.accessor,
                      );
                    }
                  }

                  return (
                    <th
                      key={index}
                      scope="col"
                      className={cn(
                        tableHeadClassName,
                        paddingMap[size],
                        column.className,
                      )}
                    >
                      <div className="flex items-center">
                        {typeof column.header === "function"
                          ? column.header(column)
                          : column.header}
                        {column.isSortable && sortFieldName && (
                          <SortIcons fieldName={sortFieldName} />
                        )}
                      </div>
                    </th>
                  );
                })}
                {/* {hasOptionsColumn && (
                  <th className={cn(tableOptionsClasses)}></th>
                )} */}
              </tr>
            </thead>
            <tbody className="divide-neutral-content/70 dark:divide-base-3 dark:bg-neutral divide-y bg-white">
              {customRender
                ? customRender
                : data?.length > 0 &&
                  !isLoading &&
                  data?.map((row, rowIndex) => {
                    const rowId = getRowId(row);
                    // const options = showTableOptions?.(row);

                    return (
                      <tr
                        key={rowIndex}
                        className={cn(
                          "hover:bg-neutral-content/60 hover:dark:bg-base-3/70",
                          onRowClick && "cursor-pointer",
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {enableRowSelection && (
                          <TableCell isMuted={isMuted}>
                            <Checkbox
                              checked={selectedIds.includes(rowId)}
                              onChange={() => onRowSelection?.(rowId)}
                              size="sm"
                            />
                          </TableCell>
                        )}
                        {columns?.map((column, colIndex) => (
                          <TableCell
                            key={colIndex}
                            className={cn(column.className)}
                            isMuted={isMuted}
                          >
                            {renderCell(row, column)}
                          </TableCell>
                        ))}
                        {/* {options &&
                          hasOptionsColumn &&
                          (() => {
                            return hasAnyActionPermission(options) ? (
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <AccessControlledMenu {...options} />
                              </TableCell>
                            ) : null;
                          })()} */}
                      </tr>
                    );
                  })}

              {isLoading && (
                <>
                  {Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(columns?.length || 4)
                          .fill(null)
                          .map((_, i) => (
                            <td
                              key={i}
                              className={`p-1 text-center`}
                              style={{
                                height: loadingHeightMap[size],
                              }}
                            >
                              <div
                                className={cn(
                                  "shimmer h-full rounded bg-gray-200/70",
                                )}
                              ></div>
                            </td>
                          ))}
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <Pagination
          className="mt-4"
          selectedIds={selectedIds}
          {...pagination}
        />
      )}
    </div>
  );
}

const paddingMap = {
  sm: "px-3 py-2",
  md: "px-6 py-3",
  lg: "px-7 py-4",
};

const loadingHeightMap = {
  sm: "37px",
  md: "53px",
  lg: "61px",
};

const checkboxClasses = `text-left flex pr-1 pl-3`;

export type TableColumn<T> = {
  header: React.ReactNode | ((column: TableColumn<T>) => React.ReactNode);
  accessor: keyof T | ((data: T) => React.ReactNode);
  cell?: (value: any, row: T) => React.ReactNode;
  isSortable?: boolean;
  sortField?: string; // Optional: Override the field name for sorting (defaults to auto-extracted from accessor)
  className?: string;
  id?: string;
};

interface BaseTableCommonProps<T> {
  columns?: TableColumn<T>[];
  data: T[];
  filterComponent?: React.ReactNode;
  pagination?: PaginationProps;
  isLoading?: boolean;
  emptyMessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  rowSelectionKey?: keyof T;
  onRowClick?: (row: T) => void;
  // showTableOptions?: (row: T) => AccessControlledMenuProps;
  customRender?: React.ReactNode;
  isMuted?: boolean;
}

interface TablePropsWithoutSelection<T> extends BaseTableCommonProps<T> {
  enableRowSelection?: false;
}

interface TablePropsWithSelection<T> extends BaseTableCommonProps<T> {
  enableRowSelection: true;
  selectedIds: string[];
  onRowSelection: (id: string) => void;
}

type TableProps<T> = TablePropsWithSelection<T> | TablePropsWithoutSelection<T>;

const tableHeadClassName =
  "dark:text-neutral-content text-neutral text-left text-xs font-semibold tracking-wider uppercase text-nowrap";
// const tableOptionsClasses = `w-10`;

function extractFieldNameFromAccessor(accessor: Function): string {
  const funcString = accessor.toString();
  const match = funcString.match(/\.(\w+)\s*$/);
  return match ? match[1] : "";
}

function SortIcons({ fieldName }: SortIconsProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;

  const isActiveField = searchParams.sortByField === fieldName;
  const isAscending = searchParams.isAscending === "true";

  const handleSort = (ascending: string) => {
    navigate({
      search: (prev: Record<string, any>) => ({
        ...prev,
        sortByField: fieldName,
        isAscending: ascending,
      }),
    } as any);
  };

  return (
    <div className="flex-co ml-0.5 flex">
      <MoveUp
        size={12}
        strokeWidth={3}
        className={cn(
          "cursor-pointer",
          isActiveField && isAscending
            ? "text-primary-600 dark:text-neutral-content"
            : "text-base-3 dark:text-base-2",
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleSort("true");
        }}
      />
      <MoveDown
        size={12}
        strokeWidth={3}
        className={cn(
          "cursor-pointer",
          isActiveField && !isAscending
            ? "text-primary-600 dark:text-neutral-content"
            : "text-base-3 dark:text-base-2",
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleSort("false");
        }}
      />
    </div>
  );
}
