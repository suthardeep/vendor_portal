import Select, { type SelectOption } from "@/components/base/Select";
import { staffQueries } from "@/features/settings/staff/staffQueries";
import { staffServices } from "@/features/settings/staff/staffServices";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

interface StaffSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  error?: string;
  label?: string;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({
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
    queryKey: staffQueries.keys.infiniteList({
      search: debouncedSearch,
    }),
    queryFn: ({ pageParam = 1 }) => {
      return staffServices.getStaff({
        search: debouncedSearch,
        currentPage: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return lastPage.meta.currentPage + 1;
    },
  });

  const staffOptions: SelectOption[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        (page?.data ?? []).map((staff: any) => ({
          label: staff.name,
          value: staff.uniqueId,
        })),
      ) ?? []
    );
  }, [data]);

  const hasSelected = staffOptions.find((e) => e.value === value);

  const { data: selectedStaff } = useQuery({
    ...staffQueries.getStaffDetails(value || ""),
    enabled: !!value && !hasSelected,
  });

  const selected: SelectOption | undefined = hasSelected?.value
    ? hasSelected
    : selectedStaff?.uniqueId
      ? { label: selectedStaff.name, value: selectedStaff.uniqueId }
      : undefined;

  const options: SelectOption[] = useMemo(() => {
    if (!selected) return staffOptions;
    const filtered = staffOptions.filter((o) => o.value !== selected.value);
    return [selected, ...filtered];
  }, [staffOptions, selected]);

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
      placeholder="Select Staff"
      isLoading={isLoading || isFetching}
      onInputChange={handleInputChange}
      onChange={(opt) => onChange((opt as SelectOption<string>)?.value)}
      onMenuScrollToBottom={handleScrollToEnd}
      error={error}
      label={label ?? "Staff"}
    />
  );
};

export default StaffSelector;
