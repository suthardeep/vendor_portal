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
          ? "dark:border-primary-400 dark:bg-primary-700/20 bg-primary-50/30 border-primary-500"
          : "border-neutral-content dark:bg-base-3 dark:border-base-3 bg-neutral-content/60 hover:bg-neutral-content hover:dark:bg-base-3",
        className,
      )}
    >
      {" "}
      {children}{" "}
    </div>
  );
};

export default SelectionCard;
