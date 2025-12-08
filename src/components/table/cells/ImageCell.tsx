import { cn } from "@/utils/helpers";
import React from "react";
import { ImageCellConfig } from "../table.types";

interface ImageCellProps extends ImageCellConfig {
  row: any;
}

export const ImageCell: React.FC<ImageCellProps> = ({
  row,
  srcKey = "image",
  altKey = "name",
  size = "md",
  fallback = "/placeholder.png",
  rounded = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <img
      src={row[srcKey] || fallback}
      alt={row[altKey] || ""}
      className={cn(
        "object-cover",
        sizeClasses[size],
        rounded && "rounded-lg"
      )}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
};