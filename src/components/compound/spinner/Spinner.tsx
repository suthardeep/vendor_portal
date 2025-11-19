import React from "react";
import { cn } from "@/utils/helpers";

type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { size = 16, className } = props;

  return (
    <svg
      className={cn(
        `spinner stroke-base-3 dark:stroke-base-2`,
        className,
      )}
      viewBox="0 0 50 50"
      style={{
        width: size + "px",
        height: size + "px",
      }}
    >
      <circle
        className="spinner-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
};

export default Spinner;
