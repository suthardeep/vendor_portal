import Select, { type SelectOption } from "@/components/base/Select";
import { storeQueries } from "@/features/stores/all-stores/storeQueries";
import { storeService } from "@/features/stores/all-stores/storeService";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

interface StoreSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  error?: string;
  label?: string;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  value,
  onChange,
  error,
  label,
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
    queryKey: storeQueries.keys.list({
      search: debouncedSearch,
      isAscending: true,
    }),
    queryFn: ({ pageParam = 1 }) => {
      return storeService.getStores({
        search: debouncedSearch,
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

  const storeOptions: SelectOption[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        (page?.data ?? []).map((store) => ({
          label: store?.name,
          value: store.uniqueId,
        })),
      ) ?? []
    );
  }, [data]);

  const hasSelected = storeOptions.find((e) => e.value === value);

  const { data: selectedStore } = useQuery({
    ...storeQueries.getStoreDetails(value || ""),
    enabled: !!value && !hasSelected,
  });

  const selected: SelectOption | undefined = hasSelected?.value
    ? hasSelected
    : selectedStore?.store?.uniqueId
      ? {
          label: selectedStore.store?.name,
          value: selectedStore?.store?.uniqueId,
        }
      : undefined;

  const options: SelectOption[] = useMemo(() => {
    if (!selected) return storeOptions;
    const filtered = storeOptions.filter((o) => o.value !== selected.value);
    return [selected, ...filtered];
  }, [storeOptions, selected]);

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
      placeholder="Select Store"
      isLoading={isLoading || isFetching}
      onInputChange={handleInputChange}
      onChange={(opt) => onChange((opt as SelectOption<string>)?.value)}
      onMenuScrollToBottom={handleScrollToEnd}
      error={error}
      label={label ?? "Store"}
    />
  );
};

export default StoreSelector;
