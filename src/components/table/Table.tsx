
import { cn } from "@/utils/helpers";
import React, { useState, useMemo } from "react";
import { TableProps } from "./table.types";
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
  breadcrumbs ,
  singleIcon ,
  showFooter=false ,
  footerActions=[] ,
    expandedRowConfig ,
    filterChips=[] ,
    containsAction
  

}: TableProps<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<any>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  // Use controlled or internal selection
  const selectedRows = controlledSelectedRows || internalSelectedRows;
  const setSelectedRows = onSelectionChange || setInternalSelectedRows;

  // Get row key
  const getRowKey = (row: T): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey] as string | number;
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allKeys = new Set(data.map(getRowKey));
      setSelectedRows(allKeys);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle row selection
  const handleRowSelect = (key: any, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedRows(newSelected);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (sortColumn === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortColumn(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  // Sort data if needed
  const sortedData = useMemo(() => {
    if (!sortColumn || onSort) return data; // External sorting

    const sorted = [...data].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortColumn, sortDirection, onSort]);

  // Paginate data if needed
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const pageSize = pagination.pageSize || 10;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage]);

  const allSelected = data.length > 0 && selectedRows.size === data.length;

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      {(title || searchable || filters || actions) && (
        <TableHeader
          title={title}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          filters={filters}
          actions={actions}
          breadcrumbs={breadcrumbs}
          filterChips={filterChips}
        />
      )}

      {/* Table */}
        <div className="overflow-x-auto ">
          <table className="w-full">
            <TableHead
              columns={columns}
              selectable={selectable}
              allSelected={allSelected}
              onSelectAll={handleSelectAll}
              sortColumn={sortColumn || undefined}
              sortDirection={sortDirection}
              onSort={handleSort}
               containsAction={containsAction}

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
            />
          </table>
        </div>

        {/* Pagination */}
        {pagination && !loading && data.length > 0 && (
          <TablePagination
           meta={pagination}
            showTotal={pagination.showTotal}
          />
        )}


        {showFooter && <TableFooter actions={footerActions} />}
    </div>
  );
};


