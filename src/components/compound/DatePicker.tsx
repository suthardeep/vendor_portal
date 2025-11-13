import React from "react";
import { DayPicker, type Matcher } from "react-day-picker";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  disabled?: DisabledDate;
  disablePastDates?: boolean;
}

export type DisabledDate =
  | boolean
  | Date
  | { before?: Date; after?: Date }
  | Date[]
  | ((date: Date) => boolean);

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onSelect,
  disabled,
  disablePastDates = false,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledMatcher: Matcher | Matcher[] | undefined = (() => {
    if (disablePastDates) {
      return { before: today };
    }
    if (disabled && typeof disabled !== "boolean") {
      return disabled as Matcher | Matcher[];
    }
    return undefined;
  })();

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={disabledMatcher}
    />
  );
};
