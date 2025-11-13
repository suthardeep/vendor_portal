import React, { useEffect, useRef, useState } from "react";
import { Input } from "../base/Input";
import { Clock5 } from "lucide-react";

type TimePickerInputProps = {
  value?: number | null;
  onChange?: (epoch: number | null) => void;
  showSeconds?: boolean;
  baseDateMs?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
};

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChange,
  showSeconds = false,
  baseDateMs,
  disabled = false,
  className = "",
  label = "",
  error = "",
}) => {
  const [time, setTime] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value == null) {
      setTime("");
      return;
    }
    const d = new Date(value);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    setTime(showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`);
  }, [value, showSeconds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTime(val);

    if (!val) {
      onChange?.(null);
      return;
    }

    const [hh, mm, ss] = val.split(":").map(Number);
    const base = baseDateMs ? new Date(baseDateMs) : new Date();
    base.setHours(hh, mm, ss || 0, 0);
    onChange?.(base.getTime());
  };

  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <Input
      type="time"
      ref={inputRef}
      step={300}
      value={time}
      onChange={handleChange}
      disabled={disabled}
      className={className}
      label={label}
      error={error}
      rightElement={
        <div
          className="input-icon-container cursor-pointer"
          onClick={handleIconClick}
        >
          <Clock5 size={16} />
        </div>
      }
      rightElementClassname="pr-0"
    />
  );
};

export default TimePickerInput;
