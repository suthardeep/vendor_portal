import React from "react";
import { cn } from "@/utils/helpers";

const paddingMap = {
  sm: "px-3 py-2",
  md: "px-6 py-3",
  lg: "px-7 py-4",
};

const tableBodyCellClassName =
  "text-base-3 dark:text-neutral-content text-sm font-normal whitespace-nowrap";

interface TableCellProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: any) => void;
  isMuted?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  size = "md",
  className = "",
  isMuted = false,
  onClick,
}) => {
  return (
    <td
      className={cn(
        isMuted && "pointer-events-none opacity-50",
        tableBodyCellClassName,
        paddingMap[size],
        className,
        "has-[div[aria-label='image-component']]:py-2",
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export default TableCell;
