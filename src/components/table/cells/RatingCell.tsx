import React from "react";
import Icon from "../../base/Icon";
import { RatingCellConfig } from "../table.types";

interface RatingCellProps extends RatingCellConfig {
  row: any;
  valueKey: string;
}

export const RatingCell: React.FC<RatingCellProps> = ({
  row,
  valueKey,
  icon = "star",
  showCount = true,
  countKey = "ratingCount",
}) => {
  const rating = row[valueKey];
  const count = row[countKey];

  return (
    <div className="flex items-center gap-1.5">
      <Icon
        name={icon === "star" ? "Star" : "Heart"}
        size={16}
        className="text-warning fill-warning"
      />
      <span className="text-sm font-medium text-base-content">{rating}</span>
      {showCount && count && (
        <span className="text-sm font-medium text-base-content">({count})</span>
      )}
    </div>
  );
};