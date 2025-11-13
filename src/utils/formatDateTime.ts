import dayjs from "dayjs";

type FormatOptions = {
  showDate?: boolean;
  showDay?: boolean;
  showTime?: boolean;
  showYear?: boolean;
  fallback?: string;
};

export const prettyDate = (
  date: Date | string | number | null | undefined,
  options: FormatOptions = {},
): string => {
  const {
    showDate = true,
    showDay = true,
    showTime = true,
    showYear = true,
    fallback = "Invalid Date",
  } = options;

  if (date === null || date === undefined) return fallback;

  let parsed;

  if (typeof date === "number") {
    if (date.toString().length > 10) {
      parsed = dayjs(date);
    } else {
      return "Epoch is not in millis";
    }
  } else {
    parsed = dayjs(date);
  }

  if (!parsed.isValid()) return fallback;

  const parts: string[] = [];

  if (showDate) {
    parts.push("DD MMM");
  }
  if (showYear) {
    parts.push("YY");
  }

  if (showDay) {
    parts.push("(ddd)");
  }

  const datePart = parts.join(" ");

  if (showTime) {
    const timePart = parsed.format("hh:mm A");
    return `${parsed.format(datePart)} - ${timePart}`.toUpperCase();
  }

  return parsed.format(datePart).toUpperCase();
};

export const prettyDateRange = (
  start: Date | string | number | null | undefined,
  end: Date | string | number | null | undefined,
  options: FormatOptions = {},
): string => {
  const {
    showDate = false,
    showDay = false,
    showTime = true,
    fallback = "Invalid Range",
  } = options;

  if (!start || !end) return fallback;

  const parseDate = (date: Date | string | number) => {
    if (typeof date === "number") {
      return date.toString().length === 10 ? dayjs.unix(date) : dayjs(date);
    }
    return dayjs(date);
  };

  const startParsed = parseDate(start);
  const endParsed = parseDate(end);

  if (!startParsed.isValid() || !endParsed.isValid()) return fallback;

  const formatTime = (d: dayjs.Dayjs) =>
    d.minute() === 0 ? d.format("hA") : d.format("h:mm A");

  // Check for common fields
  const sameYear = startParsed.year() === endParsed.year();
  const sameMonth = sameYear && startParsed.month() === endParsed.month();
  const sameDate = sameMonth && startParsed.date() === endParsed.date();

  if (showDate || showDay) {
    const startParts: string[] = [];
    const endParts: string[] = [];
    const commonParts: string[] = [];

    // Build date format based on what's common
    if (sameDate) {
      // Same date - only show date once, then time range
      if (showDate) startParts.push("DD MMM YY");
      if (showDay) startParts.push("(ddd)");

      const dateStr = startParsed.format(startParts.join(" ")).toUpperCase();
      const timeRange = showTime
        ? `${formatTime(startParsed)} - ${formatTime(endParsed)}`
        : "";

      return [dateStr, timeRange].filter(Boolean).join(" ");
    } else if (sameMonth) {
      // Same month and year - extract common month/year
      if (showDate) {
        startParts.push("DD");
        endParts.push("DD");
        commonParts.push("MMM");
      }
      if (sameYear) {
        commonParts.push("YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    } else if (sameYear) {
      // Same year only - extract common year
      if (showDate) {
        startParts.push("DD MMM");
        endParts.push("DD MMM");
        commonParts.push("YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    } else {
      // Different year - show full dates
      if (showDate) {
        startParts.push("DD MMM YY");
        endParts.push("DD MMM YY");
      }
      if (showDay) {
        startParts.push("(ddd)");
        endParts.push("(ddd)");
      }
    }

    const startStr = startParsed.format(startParts.join(" ")).toUpperCase();
    const endStr = endParsed.format(endParts.join(" ")).toUpperCase();
    const commonStr = commonParts.length
      ? startParsed.format(commonParts.join(" ")).toUpperCase()
      : "";

    // Build the final string
    const datePart = commonStr
      ? `${startStr} - ${endStr} ${commonStr}`
      : `${startStr} - ${endStr}`;

    if (showTime) {
      return `${datePart}, ${formatTime(startParsed)} - ${formatTime(endParsed)}`;
    }

    return datePart;
  }

  // Time-only format
  if (showTime) {
    return `${formatTime(startParsed)} - ${formatTime(endParsed)}`;
  }

  return fallback;
};