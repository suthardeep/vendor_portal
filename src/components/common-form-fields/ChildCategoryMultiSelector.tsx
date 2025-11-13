import type { SelectOption } from "@/components/base/Select";
import { categoryQueries } from "@/features/category/categoryQueries";
import { categoryServices } from "@/features/category/categoryService";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { MultiSelectWithChips } from "../compound/MultiSelectWithChips";

const ChildCategoryMultiSelect: React.FC<ChildCategoryMultiSelectProps> = ({
  value = [],
  onChange,
  parentId,
  error,
  label,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["childCategories", parentId, debouncedSearch],
      queryFn: ({ pageParam = 1 }) =>
        categoryServices.getCategories({
          isParent: false,
          search: debouncedSearch,
          sortByField: "name",
          isAscending: true,
          currentPage: pageParam,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.meta?.hasNextPage) return undefined;
        return lastPage.meta.currentPage + 1;
      },
    });

  const allRows = data?.pages?.flatMap((p) => p.data) ?? [];

  const childCategoryOptions: SelectOption[] = useMemo(() => {
    return (
      allRows?.map((e) => ({
        label: e?.name,
        value: e?.uniqueId,
      })) ?? []
    );
  }, [data]);

  const selectedFromOptions = useMemo(() => {
    return value
      .map((val) => childCategoryOptions.find((opt) => opt.value === val))
      .filter(Boolean) as SelectOption[];
  }, [childCategoryOptions, value]);

  const missingValueIds = useMemo(() => {
    const currentIds = new Set(childCategoryOptions.map((opt) => opt.value));
    return value.filter((val) => !currentIds.has(val));
  }, [childCategoryOptions, value]);

  const missingQueries = useQueries({
    queries: missingValueIds.map((id) =>
      categoryQueries.getCategoryDetails(id),
    ),
  });

  const missingOptions: SelectOption[] = useMemo(() => {
    return missingQueries
      .map((q) => q.data)
      .filter(Boolean)
      .map((cat) => ({
        label: cat?.name ?? "",
        value: cat?.uniqueId ?? "",
      }));
  }, [missingQueries]);

  const selectedOptions: SelectOption[] = useMemo(() => {
    return [...selectedFromOptions, ...missingOptions];
  }, [selectedFromOptions, missingOptions]);

  const handleInputChange = useCallback((val: string) => {
    setSearch(val.trim());
  }, []);

  const handleScrollToEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleChange = (selected: SelectOption[]) => {
    onChange(selected.map((opt) => opt.value));
  };

  return (
    <MultiSelectWithChips
      options={childCategoryOptions}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={"Select Child Categories"}
      isLoading={isLoading || isFetchingNextPage}
      onInputChange={handleInputChange}
      error={error}
      label={label ?? "Child categories"}
      onMenuScrollToBottom={handleScrollToEnd}
    />
  );
};

export default ChildCategoryMultiSelect;

interface ChildCategoryMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  parentId?: string;
  label?: string;
  error?: string;
}
