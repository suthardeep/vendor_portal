import { cn } from "@/utils/helpers";
import Label from "../base/Label";

interface BaseProps {
  isActive: boolean;
  label?: string;
  required?: boolean;
  activeLabelName?: string;
  inactiveLabelName?: string;
  fullWidth?: boolean;
}

interface ReadProps extends BaseProps {
  readonly: true;
}

interface WriteProps extends BaseProps {
  readonly: false;
  onChange: (value: boolean) => void;
}

type ActiveIndicatorProps = ReadProps | WriteProps;

const baseClass = `bg-neutral-content dark:bg-neutral border transition-colors font-medium`;
const commonClass = `px-3 py-2`;
const baseTextClass = `text-base-3 dark:text-neutral-content border border-transparent duration-300`;

const activeClass = {
  true: "text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-950/50 border-green-600 dark:border-green-500",
  false:
    "text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-950/50 border-red-600 dark:border-red-300/60",
};

const ActiveIndicator: React.FC<ActiveIndicatorProps> = (props) => {
  const {
    isActive,
    readonly,
    label,
    required,
    activeLabelName,
    inactiveLabelName,
    fullWidth = false,
  } = props;

  const handleToggle = () => {
    if (!readonly) {
      props.onChange(!isActive);
    }
  };

  return (
    <div className={cn("flex flex-col items-start", fullWidth && "w-full")}>
      {label && (
        <Label required={required} className="mb-1">
          {" "}
          {label}{" "}
        </Label>
      )}
      <div className={cn("fall", fullWidth && "w-full")}>
        <button
          onClick={handleToggle}
          type="button"
          className={cn(
            "rounded-l-md",
            baseClass,
            commonClass,
            fullWidth && "w-full",
            isActive ? activeClass.true : baseTextClass,
            readonly ? "cursor-not-allowed" : "cursor-pointer",
            !readonly &&
              !isActive &&
              "hover:border-neutral-content hover:dark:border-base-3",
          )}
        >
          <p>{activeLabelName || "True"}</p>
        </button>
        <button
          onClick={handleToggle}
          type="button"
          className={cn(
            "rounded-r-md",
            baseClass,
            fullWidth && "w-full",
            commonClass,
            !isActive ? activeClass.false : baseTextClass,
            readonly ? "cursor-not-allowed" : "cursor-pointer",
            !readonly &&
              isActive &&
              "hover:border-neutral-content hover:dark:border-base-3",
          )}
        >
          <p>{inactiveLabelName || "False"}</p>
        </button>
      </div>
    </div>
  );
};

export default ActiveIndicator;
