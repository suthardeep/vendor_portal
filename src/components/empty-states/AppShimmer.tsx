import { sidebarStateUtil } from "@/components/shared/utils/sidebarUtil";
import { cn } from "@/utils/helpers";

const AppShimmer = () => {
  const isOpen = sidebarStateUtil.getCollapsedState();

  return (
    <div className="flex">
      <div
        className={cn(
          "border-r-nl-200 dark:border-r-nd-600 dark:bg-nd-900 h-dvh border bg-white px-3 py-1.5",
          isOpen ? "w-64" : "w-[67px]",
        )}
      >
        <div className="shimmer mt-1 h-10 w-full" />
        <div className="mt-5 flex flex-col gap-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="shimmer h-9 w-full opacity-50" key={i} />
          ))}
        </div>
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div className="dark:bg-nd-800 border-b-nl-100 dark:border-b-nd-600 flex h-[61px] w-full items-center gap-x-4 border bg-white px-5">
          <div className="shimmer mr-auto h-8 w-md" />
          <div className="shimmer size-8" />
          <div className="shimmer size-8" />
        </div>
        <div className="dark:bg-nd-900 h-full w-full grow bg-white p-6">
          <div className="shimmer h-[85dvh] w-full opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default AppShimmer;
