import { Button } from "@/components/base/Button";
import Checkbox from "@/components/base/Checkbox";
import { mediaPickerQueries } from "@/features/media-picker/mediaPickerQueries";
import { mediaPickerServices } from "@/features/media-picker/mediaPickerServices";
import type { UploadResult } from "@/types/uploader.types";
import { cn } from "@/utils/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import ImageComponent from "../ImageComponent";
import useDebounce from "@/hooks/useDebounce";
import NoSearchResult from "@/components/empty-states/NoSearchResult";

interface SearchMediaListProps {
  searchVal: string;
  selectedMedia?: UploadResult[];
  onImageClick: (media: UploadResult) => void;
}

const SearchMediaList: React.FC<SearchMediaListProps> = (props) => {
  const { searchVal, onImageClick, selectedMedia } = props;
  const debouncedValue = useDebounce(searchVal, 400);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: mediaPickerQueries.keys.groupMediaList({
        search: debouncedValue,
      }),
      queryFn: ({ pageParam }) => {
        return mediaPickerServices.getGroupMediaList({
          search: debouncedValue,
          currentPage: pageParam,
          pageSize: 24,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.hasNextPage) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
    });

  const allMedia = data?.pages.flatMap((page) => page.data) ?? [];

  const handleImageSelect = (media: UploadResult) => {
    onImageClick(media);
  };

  const isAllSelected =
    allMedia.length > 0 && allMedia.every((m) => selectedMedia?.includes(m));

  const isIndeterminate =
    (selectedMedia ?? []).length > 0 &&
    !isAllSelected &&
    allMedia.length > 0 &&
    allMedia.some((m) => selectedMedia?.includes(m));

  const handleCheck = () => {
    if (isAllSelected && selectedMedia) {
      allMedia.forEach((media) => {
        if (selectedMedia.includes(media)) {
          onImageClick(media);
        }
      });
    } else {
      allMedia.forEach((media) => {
        if (selectedMedia && !selectedMedia.includes(media)) {
          onImageClick(media);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[218px]">
        <div className="mb-4 flex justify-between">
          <div className="shimmer h-[38px] w-72" />
          <div className="shimmer h-[38px] w-64" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div className="shimmer size-28 shrink-0" key={i} />
            ))}
        </div>
        <div className="mt-6 flex justify-between">
          <div className="shimmer h-[28px] w-64" />
          <div className="shimmer h-[28px] w-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[218px]">
      <div className="mb-4 flex items-center gap-x-3">
        <h6 className="text-nl-600 dark:text-nd-300 mr-auto">
          Search results for{" "}
          <span className="dark:text-nd-100 text-nl-700 text-base">
            {searchVal}
          </span>
        </h6>
        <Checkbox
          label="Select all"
          onChange={handleCheck}
          checked={isAllSelected}
          indeterminate={isIndeterminate}
        />
      </div>

      <div className="no-scrollbar grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 overflow-y-auto">
        {allMedia?.map((media, i) => {
          const isSelected = (media: UploadResult) => {
            return selectedMedia?.some((m) => m.path === media.path);
          };
          const selected = isSelected(media);

          return (
            <div key={i} className="relative">
              <button
                onClick={() => handleImageSelect(media)}
                className={cn(
                  `fall relative block w-full rounded-lg border-2 border-transparent p-0.5 transition-all`,
                  selected && `border-pl-500 dark:border-pd-600`,
                )}
              >
                <ImageComponent
                  alt={media.name}
                  src={media.path}
                  className={cn(
                    "size-28 shrink-0 rounded-lg object-cover transition-all",
                    selected && "scale-[85%]",
                  )}
                />

                {selected && (
                  <div className="dark:bg-pd-50 absolute right-1 bottom-1 z-10 rounded-full bg-white p-1">
                    <Check
                      size={12}
                      className="dark:text-pd-500 text-pl-600"
                      strokeWidth={4}
                    />
                  </div>
                )}

                {selected && (
                  <div className="bg-pl-600/20 dark:bg-pd-500/20 absolute inset-0 rounded-lg" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {allMedia.length < 1 && (
        <NoSearchResult
          classname="mx-auto"
          message={`No search results found for ${searchVal}`}
        />
      )}

      {hasNextPage && (
        <div className="fall mt-6">
          <Button
            color="neutral"
            onClick={() => fetchNextPage()}
            disabled={isLoading || isFetchingNextPage}
            isLoading={isFetchingNextPage}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchMediaList;
