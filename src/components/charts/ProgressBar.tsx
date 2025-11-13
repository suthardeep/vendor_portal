type ProgressBarProps = {
  progress: number;
  total: number;
  height?: number;
  className?: string;
  barClassName?: string;
  bgClassName?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  height = 20,
  className = "",
  barClassName = "fill-gray-800 dark:fill-white",
  bgClassName = "fill-gray-200 dark:fill-gray-700",
}) => {
  const clampedProgress = Math.min(Math.max(progress / total, 0), 1);

  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemax={total}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height={height}
          rx={height / 2}
          ry={height / 2}
          className={bgClassName}
        />
        <rect
          x="0"
          y="0"
          width={100 * clampedProgress}
          height={height}
          rx={height / 2}
          ry={height / 2}
          className={barClassName}
        />
      </svg>
    </div>
  );
};

export default ProgressBar;
