import { cn } from "@/utils/helpers";
import React from "react";
import {Icon} from "../base/Icon";
import { PaginationMeta } from "@/types/baseApi";

type TablePaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  meta,
  onPageChange,
  showTotal = true,
}) => {
  const {
    currentPage,
    pageSize,
    totalRows,
    totalPages,
    hasPrevPage,
    hasNextPage,
    
  } = meta;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const buttonBaseClass = "min-w-[36px] h-9 flex items-center justify-center rounded text-sm font-medium transition-colors";

  // Calculate showing range
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-base-1 border-base-3">
      {showTotal && (
        <div className="text-sm text-body-content">
          Showing {startRow} to {endRow} of {totalRows} entries
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className={cn(
            buttonBaseClass,
            "px-3",
            !hasPrevPage
              ? "bg-neutral/20 text-disabled-content cursor-not-allowed"
              : "bg-neutral/20 text-body-content hover:bg-base-3"
          )}
        >
          <Icon name="ChevronsLeft" size={18} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={cn(
            buttonBaseClass,
            "px-3",
            !hasPrevPage
              ? "bg-neutral/10 text-disabled-content cursor-not-allowed"
              : "bg-neutral/10 text-body-content hover:bg-base-3"
          )}
        >
          <Icon name="ChevronLeft" size={18} />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${idx}`}
                className={cn(buttonBaseClass, "px-3 text-body-content")}
              >
                ...
              </div>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                buttonBaseClass,
                "px-3",
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-neutral/10 text-body-content hover:bg-base-3"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={cn(
            buttonBaseClass,
            "px-3",
            !hasNextPage
              ? "bg-neutral/10 text-disabled-content cursor-not-allowed"
              : "bg-neutral/10 text-body-content hover:bg-base-3"
          )}
        >
          <Icon name="ChevronRight" size={18} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className={cn(
            buttonBaseClass,
            "px-3",
            !hasNextPage
              ? "bg-neutral/20 text-disabled-content cursor-not-allowed"
              : "bg-neutral/20 text-body-content hover:bg-base-3"
          )}
        >
          <Icon name="ChevronsRight" size={18} />
        </button>
      </div>
    </div>
  );
};