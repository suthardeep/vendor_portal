import { cn } from "@/utils/helpers";
import React from "react";
import { ImageCellConfig } from "../table.types";
import { Image } from "@/components/base/Image";

interface ImageCellProps extends ImageCellConfig {
  row: any;
}

export const ImageCell: React.FC<ImageCellProps> = ({
  row,
  srcKey = "image",
  altKey = "name",
  size = "md",
  fallback = "/placeholder.png",
  className,
  align = "left",
  expandOnClick = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const alignmentClasses = {
    left: "flex items-center justify-start",
    center: "flex items-center justify-center",
    right: "flex items-center justify-end",
  };

  return (
    <div className={cn(alignmentClasses[align])}>
      <div className={cn(sizeClasses[size])}>
        <Image
          src={row[srcKey] || fallback}
          alt={row[altKey] || ""}
          className={className}
          expandOnClick={expandOnClick}
          // className="rounded-lg"
        />
      </div>
    </div>
  );
};
