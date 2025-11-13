import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { categoryQueries } from "@/features/category/categoryQueries";
import { categoryServices } from "@/features/category/categoryService";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

type ParentCategorySelectProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
} & Pick<CustomSelectProps, "menuPlacement" | "label" | "error">;

const ParentCategorySelect: React.FC<ParentCategorySelectProps> = ({
  value,
  onChange,
  error,
  label,
  menuPlacement,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: categoryQueries.keys.list({
      isParent: true,
      search: debouncedSearch,
      sortByField: "name",
      isAscending: true,
    }),
    queryFn: ({ pageParam = 1 }) => {
      return categoryServices.getCategories({
        isParent: true,
        search: debouncedSearch,
        sortByField: "name",
        isAscending: true,
        currentPage: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return lastPage.meta.currentPage + 1;
    },
  });

  const parentCategoryOptions: SelectOption[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        (page?.data ?? []).map((i: any) => ({
          label: i.name,
          value: i.uniqueId,
        })),
      ) ?? []
    );
  }, [data]);

  const hasSelected = parentCategoryOptions.find((e) => e.value === value);

  const { data: selectedCategory } = useQuery({
    ...categoryQueries.getCategoryDetails(value || ""),
    enabled: !!value && !hasSelected,
  });

  const selected: SelectOption | undefined = hasSelected?.value
    ? hasSelected
    : selectedCategory?.uniqueId
      ? { label: selectedCategory.name, value: selectedCategory.uniqueId }
      : undefined;

  const options: SelectOption[] = useMemo(() => {
    if (!selected) return parentCategoryOptions;
    const filtered = parentCategoryOptions.filter(
      (o) => o.value !== selected.value,
    );
    return [selected, ...filtered];
  }, [parentCategoryOptions, selected]);

  const handleInputChange = useCallback((val: string) => {
    setSearch(val.trim());
  }, []);

  const handleScrollToEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Select<string>
      options={options}
      value={selected}
      isMulti={false}
      placeholder="Select Parent Category"
      isLoading={isLoading || isFetching}
      onInputChange={handleInputChange}
      onChange={(opt) => onChange((opt as SelectOption<string>)?.value)}
      onMenuScrollToBottom={handleScrollToEnd}
      error={error}
      label={label ?? "Parent category"}
      menuPlacement={menuPlacement}
    />
  );
};

export default ParentCategorySelect;
