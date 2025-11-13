import { riderQueries } from "@/features/riders/all-riders/riderQueries";
import { riderService } from "@/features/riders/all-riders/riderService";
import type { Rider } from "@/features/riders/all-riders/types/rider.types";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { OptionProps } from "react-select";
import { components } from "react-select";
import Select, { type SelectOption } from "../base/Select";

interface RiderSelectProps {
  value: string;
  onChange: (value: string | undefined) => void;
  error?: string;
  label?: string;
}

const RiderSelect: React.FC<RiderSelectProps> = ({
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
    queryKey: riderQueries.keys.list({
      search: debouncedSearch,
    }),
    queryFn: ({ pageParam = 1 }) =>
      riderService.getRiders({
        search: debouncedSearch,
        currentPage: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNextPage) return undefined;
      return lastPage.meta.currentPage + 1;
    },
  });

  const options: SelectOption<string, Rider>[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        (page?.data ?? []).map((rider: Rider) => ({
          label: rider.name,
          value: rider.uniqueId,
          custom: rider,
        })),
      ) ?? []
    );
  }, [data]);

  const hasSelected = options.find((e) => e.value === value);

  const { data: selectedRider } = useQuery({
    ...riderQueries.getRiderDetails(value || ""),
    enabled: !!value && !hasSelected,
  });

  const selected: SelectOption<string, Rider> | null = hasSelected
    ? hasSelected
    : selectedRider?.uniqueId
      ? {
          label: selectedRider.name,
          value: selectedRider.uniqueId,
          custom: selectedRider,
        }
      : null;

  const finalOptions: SelectOption<string, Rider>[] = useMemo(() => {
    if (!selected) return options;
    const filtered = options.filter((o) => o.value !== selected.value);
    return [selected, ...filtered];
  }, [options, selected]);

  const handleInputChange = useCallback((val: string) => {
    setSearch(val.trim());
    return val;
  }, []);

  const handleScrollToEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Select<string, Rider>
      options={finalOptions}
      value={selected}
      onChange={(opt) => onChange((opt as SelectOption<string>)?.value)}
      placeholder="Select Rider"
      isLoading={isLoading || isFetching}
      onInputChange={handleInputChange}
      onMenuScrollToBottom={handleScrollToEnd}
      components={{ Option: CustomRiderOption }}
      error={error}
      label={label ?? "Rider"}
    />
  );
};

export default RiderSelect;

const CustomRiderOption = (props: OptionProps<SelectOption>) => {
  const rider = props.data.custom as Rider;
  return (
    <components.Option {...props}>
      <div className="flex flex-col">
        <p className="text-nl-700 dark:text-nd-100 font-medium">{rider.name}</p>
        <span className="text-nl-500 dark:text-nd-300 flex items-center">
          #{rider.uniqueId} •{" "}
          <Phone size={10} className="text-nl-500 dark:text-nd-300 mr-1 ml-2" />{" "}
          {rider.phone}
        </span>
      </div>
    </components.Option>
  );
};
