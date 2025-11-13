import { categoryQueries } from "@/features/category/categoryQueries";
import { zoneQueries } from "@/features/zones/zoneQueries";
import { prettyDate } from "@/utils/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Tags, X } from "lucide-react";
import { IconButton } from "../base/IconButton";
import { Popover } from "./Popover";
import Divider from "../base/Divider";

interface AppliedFiltersProps {
  searchParams: Record<string, any>;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = (props) => {
  const { isAscending, sortByField } = useSearch({ strict: false });
  const { searchParams } = props;

  const router = useRouter();

  const { data: cityDetails } = useQuery(
    zoneQueries.getZoneDetails(searchParams.city || ""),
  );
  const { data: categoryDetails } = useQuery(
    categoryQueries.getCategoryDetails(searchParams.categoryId),
  );
  const { data: subCategoryDetails } = useQuery(
    categoryQueries.getCategoryDetails(searchParams.subCategoryId),
  );

  if (Object.keys(searchParams).length === 0) return;

  const hasSorting = sortByField !== undefined;

  const filterItems: FilterItem[] = Object.entries(searchParams)
    .filter(([key, _]) => key !== "sortByField" && key !== "isAscending")
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => ({
      label: key,
      value: String(value),
    }));

  if (filterItems.length === 0 && !hasSorting) return null;

  const formatters: Record<string, (value: string) => string | undefined> = {
    city: (value) => cityDetails ? `${cityDetails.city}, ${cityDetails.state}` : value,
    categoryId: (value) => categoryDetails?.name ?? value,
    subCategoryId: (value) => subCategoryDetails?.name ?? value,
    startDate: (value) => prettyDate(value, { showTime: false }),
    endDate: (value) => prettyDate(value, { showTime: false }),
  };

  const handleClear = (key: string) => {
    const currentSearch = { ...router.state.location.search } as any;
    delete currentSearch[key];

    router.navigate({
      search: currentSearch as any,
    });
  };

  const handleClearAll = () => {
    router.navigate({
      search: {} as any,
    });
  };

  const handleClearSort = () => {
    const currentSearch = { ...router.state.location.search } as any;
    delete currentSearch.sortByField;
    delete currentSearch.isAscending;

    router.navigate({
      search: currentSearch as any,
    });
  };

  const noActiveFilers = filterItems?.length < 1;

  return (
    <div className="fade-in">
      <Popover
        trigger={
          <IconButton
            icon={Tags}
            iconClassName="dark:text-nd-100 text-nl-600"
          />
        }
      >
        <div className="p-1 px-2">
          <div className="flex items-center justify-between">
            <p className="dark:text-nd-50 text-nl-700"> Active filters </p>
            <button
              className="dark:text-nd-200 text-nl-500 hover:dark:text-nd-50 hover:text-nl-700 cursor-pointer text-xs font-medium disabled:cursor-not-allowed disabled:opacity-30"
              onClick={handleClearAll}
              disabled={noActiveFilers}
            >
              {" "}
              Clear all{" "}
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-y-2">
            {!noActiveFilers ? (
              <>
                {filterItems.map((item, index) => {
                  let displayValue: string = item.value;
                  const formatterFn = formatters[item.label];

                  if (formatterFn) {
                    displayValue = formatterFn(item.value) || "";
                  }

                  return (
                    <FilterItem
                      key={index}
                      label={formatLabels(item.label)}
                      value={displayValue}
                      onClear={() => handleClear(item.label)}
                    />
                  );
                })}
              </>
            ) : (
              <p className="dark:text-nd-20 text-nl-500 text-center capitalize">
                No active filters
              </p>
            )}
          </div>
        </div>
        {hasSorting && (
          <>
            <Divider className="my-3" />
            <SortItem
              fieldName={formatSortFieldLabel(sortByField)}
              isAscending={isAscending ?? true}
              onClear={handleClearSort}
            />
          </>
        )}
      </Popover>
    </div>
  );
};

export default AppliedFilters;

interface FilterItem {
  label: string;
  value: string;
}

interface FilterItemsProps extends FilterItem {
  onClear: () => void;
}

const FilterItem: React.FC<FilterItemsProps> = (props) => {
  const { label, onClear, value } = props;

  return (
    <div className="bg-nl-50 dark:bg-nd-600 flex min-w-52 items-center justify-between rounded-md px-2.5 py-1.5">
      <div>
        <p className="dark:text-nd-200 text-nl-500 capitalize">
          {addSpaceToCamelCase(label)}
        </p>
        <p className="dark:text-nd-50 text-nl-700 capitalize"> {value} </p>
      </div>
      <IconButton icon={X} size={"xs"} onClick={onClear} />
    </div>
  );
};

function addSpaceToCamelCase(str: string): string {
  return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
}

const formatLabels = (key: string) => {
  switch (key) {
    case "categoryId":
      return "Category";
    case "subCategoryId":
      return "Sub Category";

    default:
      return key;
  }
};

const formatSortFieldLabel = (fieldName: string) => {
  return addSpaceToCamelCase(fieldName);
};

interface SortItemProps {
  fieldName: string;
  isAscending: boolean;
  onClear: () => void;
}

const SortItem: React.FC<SortItemProps> = (props) => {
  const { fieldName, isAscending, onClear } = props;

  return (
    <div className="p-1 px-2">
      <p className="dark:text-nd-50 text-nl-700"> Sorting </p>

      <div className="bg-nl-50 dark:bg-nd-600 mt-2 flex min-w-52 items-center justify-between rounded-md px-2.5 py-1.5">
        <p className="dark:text-nd-50 text-nl-700 capitalize">
          {fieldName}{" "}
          <span>({isAscending === true ? "Ascending" : "Descending"})</span>
        </p>
        <IconButton icon={X} size={"xs"} onClick={onClear} />
      </div>
    </div>
  );
};
