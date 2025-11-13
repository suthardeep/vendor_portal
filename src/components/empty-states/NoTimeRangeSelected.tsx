import { TimeRangeButton } from "@/components/compound/time-range/TimeRangeButton";
import { cn } from "@/utils/helpers";
import { ClockAlert } from "lucide-react";

interface NoTimeRangeSelectedProps {
  classname?: string;
}

const NoTimeRangeSelected: React.FC<NoTimeRangeSelectedProps> = (props) => {
  const { classname } = props;
  return (
    <div
      className={cn(
        "fall bg-nl-50 dark:bg-nd-700 flex w-full flex-col gap-4 rounded-xl p-8",
        classname,
      )}
    >
      <ClockAlert size={48} strokeWidth={1.5} />
      <p className="text-nl-600 dark:text-nd-200 mt-4">
        Please select a time range to view available shifts
      </p>
      <div>
        <TimeRangeButton />
      </div>
    </div>
  );
};

export default NoTimeRangeSelected;
