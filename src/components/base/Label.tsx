import { cn } from "@/utils/helpers";
import {Icon, IconName } from "./Icon";
import { Tooltip } from "./Tooltip";
import { ReactNode } from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  required?: boolean;
  tooltip?: string | ReactNode;
  tooltipIcon?: IconName;
}

const Label: React.FC<LabelProps> = (props) => {
  const { className = "", children, tooltip, tooltipIcon = "Info", required = false, ...rest } = props;

  return (
    <div className="flex items-center justify-start">
      <label className={cn("flex items-center gap-1 text-base-content text-xs md:text-sm font-normal", className)} {...rest}>
        {children}
        {!required && <span className="text-base-content/90">(Optional)</span>}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Icon name={tooltipIcon} className="text-base-content text-xs md:text-xs" />
          </Tooltip>
        )}
      </label>
    </div>
  );
};

export {Label};
