import { Button, type ButtonProps } from "@/components/base/Button";
import { useToggle } from "@/hooks/useToggle";
import { useRouter, useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";
import Dialog from "../Dialog";
import type { TimeRange } from "./timeRange.types";
import { TimeRangeSelector } from "./TimeRangeSelector";

type TimeRangeButtonProps = Pick<ButtonProps, "variant" | "color" | "size"> & {
  classname?: string;
};

export const TimeRangeButton: React.FC<TimeRangeButtonProps> = (props) => {
  const { startDate, endDate } = useSearch({ strict: false });

  const range = useMemo(() => {
    if (startDate && endDate) {
      return {
        startDate: Number(startDate),
        endDate: Number(endDate),
      };
    }
    return null;
  }, [startDate, endDate]);

  const { close, isOpen, open } = useToggle();

  const router = useRouter();

  const formattedLabel = useMemo(() => {
    if (!range) return "Time Range";
    return `${dayjs(range.startDate).format("DD MMM YY")} - ${dayjs(
      range.endDate,
    ).format("DD MMM YY")}`;
  }, [range]);

  const handleChange = (r: TimeRange) => {
    router.navigate({
      search: {
        ...router.state.location.search,
        startDate: r.startDate.toString() || undefined,
        endDate: r.endDate.toString() || undefined,
      } as any,
    });
    close();
  };

  return (
    <>
      <Button
        variant="filled"
        color="neutral"
        startIcon="Clock5"
        onClick={open}
        {...props}
      >
        {formattedLabel}
      </Button>
      <Dialog isOpen={isOpen} close={close} title="Select Time Range">
        <TimeRangeSelector value={range ?? undefined} onChange={handleChange} />
      </Dialog>
    </>
  );
};
