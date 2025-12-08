import React from "react";
import Chip, { type ChipColor } from "@/components/base/Chip";
import { BadgeCellConfig } from "../table.types";
import { getStatusColor } from "@/components/utils/getStatusColor";
import { cn } from "demaze-ui-lib/utils";

interface BadgeCellProps extends BadgeCellConfig {
  value: string;
  className?: string;
}

// Valid ChipColor values for validation
const VALID_CHIP_COLORS = new Set<ChipColor>([
  "gray", "blue", "red", "yellow", "purple", 
  "orange", "green", "teal", "pink", "indigo", "sky"
]);

export const BadgeCell: React.FC<BadgeCellProps> = ({
  value,
  colorMap,
  variant = "soft",
  className,
}) => {
  let chipColor: ChipColor;


  console.log("colorMap" , colorMap , value)
  
  if (colorMap && colorMap[value]) {

    const mappedValue = colorMap[value];


    
    if (VALID_CHIP_COLORS.has(mappedValue as ChipColor)) {
      chipColor = mappedValue as ChipColor;
    } else {
      // If not valid, fall back to semantic mapping
      chipColor = getStatusColor(value);
    }
  } else {
    // No colorMap or value not in map, use semantic mapping
    chipColor = getStatusColor(value);
  }

  return (
    <Chip
      label={value}
      color={chipColor}
      className={cn(
        variant === "outlined"
          ? "border border-current bg-transparen"
          : variant === "filled"
            ? "!text-white"
            : "",
            "rounded-sm text-sm font-normal" ,
        className
      )}
    />
  );
};