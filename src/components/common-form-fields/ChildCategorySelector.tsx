import Select, { type SelectOption } from "@/components/base/Select";
import { categoryQueries } from "@/features/category/categoryQueries";
import { categoryServices } from "@/features/category/categoryService";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const ChildCategorySelect: React.FC<ChildCategorySelectProps> = ({
  value,
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
      enabled: !!parentId,
      queryFn: ({ pageParam = 1 }) =>
        categoryServices.getCategories({
          isParent: false,
          parentId,
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

  const childCategoryOptions: SelectOption[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        (page?.data ?? []).map((i: any) => ({
          label: i.name,
          value: i.uniqueId,
        })),
      ) ?? []
    );
  }, [data]);

  const currentSelected = useMemo(
    () => childCategoryOptions.find((opt) => opt.value === value),
    [childCategoryOptions, value],
  );

  const { data: selectedCategory, isLoading: loadingSelected } = useQuery({
    ...categoryQueries.getCategoryDetails(value || ""),
    enabled: !!value && !currentSelected,
  });

  const selectedOption: SelectOption | undefined = useMemo(() => {
    if (currentSelected) return currentSelected;
    if (selectedCategory?.uniqueId)
      return {
        label: selectedCategory.name,
        value: selectedCategory.uniqueId,
      };
    return undefined;
  }, [currentSelected, selectedCategory]);

  const options: SelectOption[] = useMemo(() => {
    if (!selectedOption) return childCategoryOptions;
    const filtered = childCategoryOptions.filter(
      (opt) => opt.value !== selectedOption.value,
    );
    return [selectedOption, ...filtered];
  }, [childCategoryOptions, selectedOption]);

  const handleInputChange = useCallback((val: string) => {
    setSearch(val.trim());
  }, []);

  const handleScrollToEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Select<string>
      options={options}
      value={selectedOption || null}
      isMulti={false}
      placeholder={
        parentId ? "Select Child Category" : "Select Parent Category first"
      }
      label={label ?? "Child category"}
      isDisabled={!parentId}
      isLoading={isLoading || isFetchingNextPage || loadingSelected}
      onInputChange={handleInputChange}
      onChange={(opt) => onChange((opt as SelectOption<string>)?.value)}
      onMenuScrollToBottom={handleScrollToEnd}
      error={error}
    />
  );
};

export default ChildCategorySelect;

interface ChildCategorySelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  parentId: string;
  label?: string;
  error?: string;
}
