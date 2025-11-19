import type { PaginationMeta } from "@/types/baseApi";
import { cn, prettyNumber } from "@/utils/helpers";
import { useRouter } from "@tanstack/react-router";
import { IconButton } from "../base/IconButton";
import Icon from "../base/Icon";

export interface PaginationProps extends PaginationMeta {
  onPageChange?: (currentPage: number) => void;
  className?: string;
  selectedIds?: string[];
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    currentPage,
    totalPages,
    totalRows,
    pageSize,
    selectedIds,
    className,
    hasNextPage,
    hasPrevPage,
  } = props;

  const router = useRouter();

  if (totalPages < 2) return;

  const goToPage = (currentPage: number) => {
    router.navigate({
      search: {
        ...router.state.location.search,
        currentPage,
        pageSize,
      } as any,
    });
  };

  const handleNextPage = () => {
    if (hasNextPage) goToPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (hasPrevPage) goToPage(currentPage - 1);
  };

  const pageList = getPageNumbers(currentPage, totalPages);
  const resultStart = (currentPage - 1) * pageSize + 1;
  const resultEnd = Math.min(currentPage * pageSize, totalRows);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      <p className="text-base-3">
        {selectedIds && selectedIds?.length > 0 && (
          <>
            {" "}
            {selectedIds?.length === pageSize
              ? "All items on this page selected"
              : `${selectedIds?.length} item selected`}{" "}
            -{" "}
          </>
        )}
        Showing {resultStart}-{resultEnd} of {prettyNumber(totalRows)} results
      </p>
      <div className="flex items-center gap-x-2">
        <Icon
          name={"ChevronLeft"}
          onClick={handlePreviousPage}
          size={"xs"}
          className={cn(basClasses, buttonColorClasses)}
          strokeWidth={1.6}
          // disabled={!hasPrevPage || currentPage < 2}
        />
        <div className="flex gap-x-1">
          {pageList.map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                className="fall dark:text-neutral-content text-base-3 size-7 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(Number(page))}
                className={cn(
                  basClasses,
                  currentPage === page
                    ? activeButtonColorClasses
                    : buttonColorClasses,
                )}
              >
                {page}
              </button>
            ),
          )}
        </div>
        <Icon
          name={"ChevronRight"}
          onClick={handleNextPage}
          size={"xs"}
          className={cn(basClasses, buttonColorClasses)}
          strokeWidth={1.6}
          // disabled={!hasNextPage || currentPage >= totalPages}
        />
      </div>
    </div>
  );
};

const basClasses = `fall h-7 min-w-7 cursor-pointer rounded-lg border px-1 text-sm transition-all`;
const buttonColorClasses = `text-base-2 dark:text-base-2 hover:text-base-3 hover:dark:text-neutral-content hover:bg-neutral-content hover:dark:bg-base-3 border-transparent`;
const activeButtonColorClasses =
  "text-base-3 dark:bg-base-3 border-neutral-content dark:border-base-2/50 dark:text-neutral-content bg-white";

export default Pagination;

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
    return pages;
  }

  pages.push(
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  );
  return pages;
}
