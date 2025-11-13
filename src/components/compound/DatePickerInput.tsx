import { useToggle } from "@/hooks/useToggle";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "react-day-picker/style.css";
import { Input } from "../base/Input";
import { Popover } from "./Popover";
import ErrorText from "../base/ErrorText";
import { cn } from "@/utils/helpers";
import { DatePicker, type DisabledDate } from "./DatePicker";

dayjs.extend(customParseFormat);

type DatePickerInputProps = {
  value?: number | null;
  onChange?: (epoch: number | null) => void;
  placeholder?: string;
  dateFormat?: string;
  disabled?: DisabledDate;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  disablePastDates?: boolean;
};

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  dateFormat = "DD/MM/YYYY",
  disabled,
  className = "",
  wrapperClassName = "",
  label = "",
  error = "",
  fullWidth = false,
  disablePastDates = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(""); // Raw input text
  const [internalEpoch, setInternalEpoch] = useState<number | null>(
    value ?? null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, toggle, close } = useToggle();

  useEffect(() => {
    if (value) {
      setInternalEpoch(value);
      setInputValue(dayjs(value).format(dateFormat));
    } else {
      setInternalEpoch(null);
      setInputValue("");
    }
  }, [value, dateFormat]);

  const handleDateSelect = (date?: Date) => {
    const epoch = date ? date.getTime() : null;
    setInternalEpoch(epoch);
    setInputValue(epoch ? dayjs(epoch).format(dateFormat) : "");
    onChange?.(epoch);
    close();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const parsed = dayjs(val, dateFormat, true);
    if (parsed.isValid()) {
      const epoch = parsed.valueOf();
      setInternalEpoch(epoch);
      onChange?.(epoch);
    } else {
      setInternalEpoch(null);
      onChange?.(null);
    }
  };

  return (
    <div className={cn("relative", fullWidth && "w-full", wrapperClassName)}>
      <Input
        ref={inputRef}
        label={label}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        rightElementClassname="pr-0"
        rightElement={
          <div
            className="input-icon-container cursor-pointer"
            onClick={() => toggle()}
          >
            <Calendar size={16} />
          </div>
        }
      />
      <Popover
        trigger={<span className="sr-only absolute right-0 bottom-0" />}
        isOpen={isOpen}
        onOpenChange={toggle}
        side="bottom"
        sideOffset={4}
      >
        <DatePicker
          selected={internalEpoch ? new Date(internalEpoch) : undefined}
          onSelect={handleDateSelect}
          disabled={disabled}
          disablePastDates={disablePastDates}
        />
      </Popover>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default DatePickerInput;
