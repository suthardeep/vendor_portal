import { cn } from "@/utils/helpers";

interface SelectionCardProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  className?: string;
}

const SelectionCard: React.FC<SelectionCardProps> = (props) => {
  const { children, isSelected, onClick, className } = props;

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-xl border transition-all",
        isSelected
          ? "dark:border-pd-400 dark:bg-pd-700/20 bg-pl-50/30 border-pl-500"
          : "border-nl-200 dark:bg-nd-700 dark:border-nd-500 bg-nl-50/60 hover:bg-nl-50 hover:dark:bg-nd-600",
        className,
      )}
    >
      {" "}
      {children}{" "}
    </div>
  );
};

export default SelectionCard;
