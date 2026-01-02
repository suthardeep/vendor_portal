import { cn } from "@/utils/helpers";
import React from "react";
import Icon from "../base/Icon";
import { PaginationMeta } from "@/types/baseApi";
import { ClassNameConfig } from "./table.types";

type TablePaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
  sticky?: boolean;
  classNameConfig?: ClassNameConfig["tablePagination"]
};

export const TablePagination: React.FC<TablePaginationProps> = ({
  meta,
  onPageChange,
  showTotal = true,
  sticky = true,
}) => {
  const { currentPage, pageSize, totalRows, totalPages, hasPrevPage, hasNextPage } = meta;

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

  const buttonBaseClass =
    "min-w-8 h-8 rounded-2xl flex items-center justify-center rounded text-xs font-medium transition-colors";

  const currentPageNum = Number(currentPage);
  const pageSizeNum = Number(pageSize);
  const totalRowsNum = Number(totalRows);
  const startRow = (currentPageNum - 1) * pageSizeNum + 1;
  const endRow = Math.min(currentPageNum * pageSizeNum, totalRowsNum);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2",
        sticky && " z-10"
      )}
    >
      {showTotal && (
        <div className="text-sm text-disabled-content ">
          Showing {startRow}-{endRow} of {totalRows}
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </div>
      )}

      {/* Go to 1st page  */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className={cn(
            buttonBaseClass,
            "px-2.5 bg-neutral/10",
            !hasPrevPage
              ? "text-disabled-content cursor-not-allowed opacity-70"
              : "text-body-content hover:bg-base-3"
          )}
          title="First page"
        >
          <Icon name="ChevronsLeft" size={16} />
        </button>

        {/* Go to Previous page  */}
        <button
          onClick={() => onPageChange(Number(currentPage) - 1)}
          disabled={!hasPrevPage}
          className={cn(
            buttonBaseClass,
            "px-2.5 bg-neutral/10",
            !hasPrevPage
              ? "text-disabled-content cursor-not-allowed opacity-70"
              : "text-body-content hover:bg-base-3"
          )}
          title="Previous page"
        >
          <Icon name="ChevronLeft" size={16} />
        </button>

        {/* Go to Clicked page  */}
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${idx}`}
                className={cn(buttonBaseClass, "px-2.5 text-body-content pointer-events-none")}
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
                "px-2.5",
                currentPage === page
                  ? "bg-primary/20 text-primary font-semibold"
                  : "bg-neutral/10 text-body-content hover:bg-base-3"
              )}
              title={`Page ${page}`}
            >
              {page}
            </button>
          );
        })}

        {/* Go to Next page  */}
        <button
          onClick={() => onPageChange(Number(currentPage) + 1)}
          disabled={!hasNextPage}
          className={cn(
            buttonBaseClass,
            "px-2.5 bg-neutral/10",
            !hasNextPage
              ? "text-disabled-content cursor-not-allowed opacity-70"
              : "text-body-content hover:bg-base-3"
          )}
          title="Next page"
        >
          <Icon name="ChevronRight" size={16} />
        </button>

        {/* Go to Last page  */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className={cn(
            buttonBaseClass,
            "px-2.5 bg-neutral/10",
            !hasNextPage
              ? "text-disabled-content cursor-not-allowed opacity-70"
              : "text-body-content hover:bg-base-3"
          )}
          title="Last page"
        >
          <Icon name="ChevronsRight" size={16} />
        </button>
      </div>
    </div>
  );
};

// FINAL SIZING:
// - h-9 (bigger buttons - was h-8)
// - py-3 (more padding - was py-2.5)
// - min-w-[36px] (slightly wider)
// - text-xs
// - sticky bottom-0
