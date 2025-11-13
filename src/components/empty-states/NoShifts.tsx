import AddShift from "@/features/riders/shift-management/components/AddShift";
import { CalendarX } from "lucide-react";

const NoShifts = () => {
  return (
    <div className="fall bg-nl-50 dark:bg-nd-700 mt-6 flex w-full flex-col gap-4 rounded-xl p-8">
      <CalendarX size={48} strokeWidth={1.5} />
      <p className="text-nl-600 dark:text-nd-200 mt-4">
        No shifts yet. Create one to get started.
      </p>
      <AddShift />
    </div>
  );
};

export default NoShifts;
