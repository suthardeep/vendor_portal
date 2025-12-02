import dayjs from "dayjs";
import React, { useState } from "react";
import { PresetRange, type TimeRange } from "./timeRange.types";
import DatePickerInput from "../DatePickerInput";
import { Button } from "@/components/base/Button";
import { cn } from "@/utils/helpers";
import SelectionCard from "../cards/SelectionCard";
import {Icon} from "@/components/base/Icon";

interface TimeRangeSelectorProps {
  value?: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
}) => {
  const [preset, setPreset] = useState<PresetRange>();
  const [startDate, setStartDate] = useState<number | null>(
    value?.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<number | null>(value?.endDate ?? null);

  const applyPreset = (p: PresetRange) => {
    if (p !== PresetRange.CUSTOM) {
      const range = getPresetRange(p);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
    setPreset(p);
  };

  const handleApply = () => {
    if (!startDate || !endDate) return;
    onChange({ startDate, endDate });
  };

  const currentRange =
    startDate && endDate ? formatDateRange(startDate, endDate) : null;

  return (
    <div className="flex flex-col gap-4">
      {currentRange && (
        <div className="dark:bg-base-3 bg-neutral-content/60 flex items-center gap-2 rounded-lg px-3 py-2">
          <Icon name="Calendar" className="text-text-secondary h-4 w-4" />
          <p className="text-base-3 dark:text-neutral-content font-medium">
            {currentRange}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {presetOptions.map((option, i) => {
          const isSelected = preset === option.value;
          return (
            <SelectionCard
              isSelected={isSelected}
              onClick={() => applyPreset(option.value)}
              className={cn(`p-4`)}
              key={i}
            >
              <p className="text-base-3 dark:text-neutral-content">{option.label}</p>
            </SelectionCard>
          );
        })}
      </div>

      {preset === PresetRange.CUSTOM && (
        <div className="mt-6">
          <h6 className="text-base-3 dark:text-neutral-content">Custom Date Range</h6>
          <div className="mt-4 flex gap-4">
            <DatePickerInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              fullWidth
            />
            <DatePickerInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              fullWidth
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button onClick={handleApply} disabled={!startDate || !endDate}>
          Apply
        </Button>
      </div>
    </div>
  );
};

function formatDateRange(startDate: number, endDate: number): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.isSame(end, "day")) {
    return start.format("MMM D, YYYY");
  }

  if (start.year() === end.year()) {
    return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
  }

  return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
}

const presetOptions: { label: string; value: PresetRange }[] = [
  { label: "Upcoming Day", value: PresetRange.UPCOMING_DAY },
  { label: "Upcoming 3 Days", value: PresetRange.UPCOMING_3_DAYS },
  { label: "Upcoming Week", value: PresetRange.UPCOMING_WEEK },
  { label: "Upcoming Month", value: PresetRange.UPCOMING_MONTH },
  { label: "Last Day", value: PresetRange.LAST_DAY },
  { label: "Last 3 Days", value: PresetRange.LAST_3_DAYS },
  { label: "Last Week", value: PresetRange.LAST_WEEK },
  { label: "Last Month", value: PresetRange.LAST_MONTH },
  { label: "Last 3 Months", value: PresetRange.LAST_3_MONTHS },
  { label: "Custom", value: PresetRange.CUSTOM },
];

function getPresetRange(preset: PresetRange): TimeRange {
  const now = dayjs();

  switch (preset) {
    case PresetRange.UPCOMING_DAY:
      return {
        startDate: now.valueOf(),
        endDate: now.add(1, "day").valueOf(),
      };
    case PresetRange.UPCOMING_3_DAYS:
      return {
        startDate: now.valueOf(),
        endDate: now.add(3, "day").valueOf(),
      };
    case PresetRange.UPCOMING_WEEK:
      return {
        startDate: now.valueOf(),
        endDate: now.add(1, "week").valueOf(),
      };
    case PresetRange.UPCOMING_MONTH:
      return {
        startDate: now.valueOf(),
        endDate: now.add(1, "month").valueOf(),
      };
    case PresetRange.LAST_DAY:
      return {
        startDate: now.subtract(1, "day").valueOf(),
        endDate: now.valueOf(),
      };
    case PresetRange.LAST_3_DAYS:
      return {
        startDate: now.subtract(3, "day").valueOf(),
        endDate: now.valueOf(),
      };
    case PresetRange.LAST_WEEK:
      return {
        startDate: now.subtract(1, "week").valueOf(),
        endDate: now.valueOf(),
      };
    case PresetRange.LAST_MONTH:
      return {
        startDate: now.subtract(1, "month").valueOf(),
        endDate: now.valueOf(),
      };
    case PresetRange.LAST_3_MONTHS:
      return {
        startDate: now.subtract(3, "month").valueOf(),
        endDate: now.valueOf(),
      };
    default:
      return { startDate: now.valueOf(), endDate: now.valueOf() };
  }
}
