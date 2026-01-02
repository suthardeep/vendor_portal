import { cn } from "@/utils/helpers";
import React, { useState, useMemo } from "react";
import { SortDirection, TableProps } from "./table.types";
import { TableHeader } from "./TableHeader";
import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableFooter } from "./TableFoot";

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable,
  searchPlaceholder,
  onSearch,
  filters,
  actions,
  selectable,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  rowKey = "id" as keyof T,
  onRowClick,
  rowActions,
  sortable = true,
  onSort,
  pagination,
  striped,
  hoverable = true,
  bordered,
  className,
  loading,
  emptyMessage,
  emptyIcon,
  breadcrumbs,
  singleIcon,
  showFooter = false,
  footerActions = [],
  expandedRowConfig,
  filterChips = [],
  containsAction,
  stickyPagination = true, // NEW: Control sticky pagination
  maxHeight , // NEW: Optional max height for scrollable content

  classNameConfig = undefined,
}: TableProps<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<any>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(pagination?.meta?.currentPage || 1);
  const shouldShowHeader = !!title || !!searchable || !!filters || !!actions;

  const selectedRows = controlledSelectedRows || internalSelectedRows;
  const setSelectedRows = onSelectionChange || setInternalSelectedRows;

  const getRowKey = (row: T): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey] as string | number;
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allKeys = new Set(data.map(getRowKey));
      setSelectedRows(allKeys);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (key: any, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (key: string) => {
    if (!sortable) return;

    let newDirection: "asc" | "desc" | "default" = "asc";

    if (sortColumn === key) {
      newDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? "default" : "asc";
    }

    if (newDirection === "default") {
      setSortColumn(null);
      setSortDirection("asc");
      onSort?.(null, "asc");
    } else {
      setSortColumn(key);
      setSortDirection(newDirection);
      onSort?.(key, newDirection);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || onSort) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortColumn, sortDirection, onSort]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const pageSize = pagination.meta.pageSize || 10;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage]);

  const allSelected = data.length > 0 && selectedRows.size === data.length;

  return (
    <div
      className={cn(
        "w-full flex flex-col shadow-sm bg-base-1 rounded-lg",
        className,
        classNameConfig?.table?.mainContainer
      )}
    >
      {/* Header */}
      {shouldShowHeader && (
        <TableHeader
          title={title}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          filters={filters}
          actions={actions}
          breadcrumbs={breadcrumbs}
          filterChips={filterChips}
          classNameConfig={classNameConfig?.tableHeader}
        />
      )}

      {/* Table Container with optional max height */}
      <div
        className={cn(
          "relative flex-1 min-h-0 ", // min-h-0 is key for nested flex scrolling
          maxHeight ? "overflow-y-auto" : "overflow-visible",
          "scrollbar-thin scrollbar-thumb-gray-300", // Optional: makes scrollbar less intrusive
          classNameConfig?.table?.tableContainer
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className={cn("w-full h-full border-separate border-spacing-0", classNameConfig?.table?.table)}>
          <TableHead
            columns={columns}
            selectable={selectable}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            sortColumn={sortColumn || undefined}
            sortDirection={sortDirection}
            onSort={handleSort}
            containsAction={containsAction}
            classNameConfig={classNameConfig?.tableHead}
            hasMainHeader={shouldShowHeader}
          />

          <TableBody
            data={paginatedData}
            columns={columns}
            selectable={selectable}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            rowKey={rowKey}
            onRowClick={onRowClick}
            hoverable={hoverable}
            striped={striped}
            loading={loading}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            actions={rowActions}
            singleIcon={typeof singleIcon === "string" ? { name: singleIcon, onClick: () => {} } : singleIcon}
            expandedRowConfig={expandedRowConfig}
            bodyClassNameConfig={classNameConfig?.tableBody}
            rowClassNameConfig={classNameConfig?.tableRow}
          />
        </table>
      </div>

      {/* Pagination - Now with sticky support */}
      {pagination && (
        <TablePagination
          meta={pagination.meta}
          onPageChange={pagination.onPageChange}
          showTotal={pagination.showTotal}
          sticky={stickyPagination}
          classNameConfig={classNameConfig?.tablePagination}
        />
      )}

      {/* Footer */}
      {showFooter && <TableFooter actions={footerActions} />}
    </div>
  );
};

// ============================================
// KEY CHANGES:
// ============================================
// 1. NEW: stickyPagination prop (default true)
// 2. NEW: maxHeight prop for scrollable content
// 3. NEW: flex flex-col layout for proper sticky positioning
// 4. NEW: Conditional pb-[52px] when pagination is sticky
// 5. NEW: overflow-y-auto when maxHeight is set
// 6. Removed nested overflow-x-auto wrapper
// 7. Pass sticky prop to TablePagination
// 8. Better layout structure for admin panels
// ============================================

// ============================================
// USAGE EXAMPLE:
// ============================================
/*
<Table
  data={users}
  columns={columns}
  title="Users"
  searchable
  pagination={{
    meta: paginationMeta,
    onPageChange: handlePageChange,
    showTotal: true
  }}
  stickyPagination={true} // Pagination always visible
  maxHeight="calc(100vh - 200px)" // Optional scrollable content
  actions={[
    { label: "Add User", icon: "Plus", variant: "primary", onClick: handleAdd }
  ]}
/>
*/
