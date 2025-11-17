import { cn } from "@/utils/helpers";

interface DividerProps {
  className?: string;
  vertical?: boolean;
}

const Divider: React.FC<DividerProps> = (props) => {
  const { className, vertical } = props;
  return (
    <div
      className={cn(
        "dark:bg-base-3 bg-neutral-content h-px w-full",
        vertical ? "h-full w-px" : "h-px w-full",
        className,
      )}
    />
  );
};

export default Divider;
