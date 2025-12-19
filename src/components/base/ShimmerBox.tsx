import { cn } from "@/utils/helpers";

// Shimmer Loading Component
const ShimmerBox: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "relative overflow-hidden bg-base-content/5 rounded-lg",
      "before:absolute before:inset-0",
      "before:-translate-x-full",
      "before:animate-[shimmer_2s_infinite]",
      "before:bg-linear-to-r",
      "before:from-transparent before:via-base-content/10 before:to-transparent",
      className
    )}
  />
);

export default ShimmerBox;